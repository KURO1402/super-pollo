const jwt = require("jsonwebtoken");
const respuestaNubefact = require("./ejemploRptaNubefact")
//Importamos validaciones
const { validarDatosVentaBoleta, validarStockInsumos } = require("../validaciones/validacionesVenta");

//Importamos el helper de ventas
const { formatearVenta } = require("../../../helpers/ventas-helpers/formatearDataVenta");
const { procesarProductosYInsumos, prepararDatosVenta } = require("../../../helpers/ventas-helpers/procesarVenta");
// Importamos servicios necesarios
const {
  obtenerDatosComprobanteService,
  actualizarCorrelativoService
} = require("../servicio/comprobantesServicio");
// Servicio de nubefact
const { generarComprobanteNubefact } = require("../../../servicios/nubefact");
const {
  registrarVentaModel
} = require("../modelo/ventasModelo");
const { consultarCajaAbiertaModel, registrarIngresoCajaModel } = require("../../caja/cajaModelo");


// Función principal del servicio
const registrarBoletaVentaService = async (datosVenta, token) => {
  // Validaciones iniciales
  await validarDatosVentaBoleta(datosVenta);
  const cajaAbierta = await consultarCajaAbiertaModel();
  if (cajaAbierta.length === 0) {
    throw Object.assign(
      new Error("Actualmente no existe una caja abierta para registrar operaciones."),
      { status: 422 }
    );
  }
  const { tipoComprobante, productos } = datosVenta;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const idUsuario = decodedToken.idUsuario;

  await validarStockInsumos(productos);

  // Obtener datos del comprobante y preparar nuevo correlativo
  const datosComprobante = await obtenerDatosComprobanteService(tipoComprobante);
  const nuevoCorrelativo = datosComprobante.ultimoCorrelativo + 1;

  const dataFormateada = await formatearVenta(datosVenta, {
    ...datosComprobante,
    ultimoCorrelativo: nuevoCorrelativo
  });
  

  // Enviar a Nubefact
  //const respuestaNubefact = await generarComprobanteNubefact(dataFormateada);

  // Si Nubefact devuelve error, retornar inmediatamente
  if (respuestaNubefact.error || respuestaNubefact.codigo) {
    return {
      ok: false,
      error: "Error en Nubefact",
      detalles: respuestaNubefact
    };
  }

  // Procesar venta exitosa
  await actualizarCorrelativoService(tipoComprobante, nuevoCorrelativo);

  const datosRegistrar = prepararDatosVenta(
    dataFormateada,
    datosVenta,
    respuestaNubefact,
    idUsuario
  );

  const respuestaVenta = await registrarVentaModel(datosRegistrar);

  // Procesar productos e insumos en paralelo
  const resultadosProcesamiento = await procesarProductosYInsumos(
    productos,
    dataFormateada,
    respuestaVenta,
    idUsuario
  );

  const mensajeCaja = await registrarIngresoCajaModel({monto: dataFormateada.total, descripcion: "venta"}, idUsuario);

  // Retornar respuesta estructurada
  return {
    venta: respuestaVenta,
    comprobanteNubefact: {
      numero: respuestaNubefact.numero,
      enlacePDF: respuestaNubefact.enlace_del_pdf,
      enlaceXML: respuestaNubefact.enlace_del_xml,
      estadoSunat: respuestaNubefact.sunat_description
    },
    procesamiento: {
      detallesRegistrados: resultadosProcesamiento.detallesVenta.length,
      movimientosStock: resultadosProcesamiento.movimientosStock.length,
      movimientos: resultadosProcesamiento.movimientosStock
    },
    caja: {
      mensaje: mensajeCaja
    },
    mensaje: "Venta registrada exitosamente"
  };
};

module.exports = {
  registrarBoletaVentaService
};