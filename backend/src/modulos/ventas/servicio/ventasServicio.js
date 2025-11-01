const jwt = require("jsonwebtoken");
//const respuestaNubefact = require("./ejemploRptaNubefact")
//Importamos validaciones
const { validarDatosVentaBoleta, validarStockInsumos, validarDatosVentaFactura, validarDatosVentaNotaCreditoBoleta } = require("../validaciones/validacionesVenta");

//Importamos el helper de ventas
const { formatearVenta } = require("../../../helpers/ventas-helpers/formatearDataVenta");
const { procesarProductosYInsumos, prepararDatosVenta } = require("../../../helpers/ventas-helpers/procesarVenta");
const restaurarCajaStock = require("../../../helpers/ventas-helpers/restaurarCajaStock")
// Importamos servicios necesarios
const {
  obtenerDatosComprobanteService,
  actualizarCorrelativoService
} = require("../servicio/comprobantesServicio");
// Servicio de nubefact
const { generarComprobanteNubefact } = require("../../../servicios/nubefact");
const {
  registrarVentaModel,
  obtenerComprobantePorIdModel,
  actualizarComprobanteAnuladoModel
} = require("../modelo/ventasModelo");
const { consultarCajaAbiertaModel, registrarIngresoCajaModel } = require("../../caja/cajaModelo");

// Función base reutilizable
const registrarVentaBase = async (datosVenta, token, funcionValidacion) => {
  // Validaciones iniciales
  await funcionValidacion(datosVenta);
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
  const respuestaNubefact = await generarComprobanteNubefact(dataFormateada);

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
    idUsuario,
    respuestaVenta.idVenta
  );

  const mensajeCaja = await registrarIngresoCajaModel({ monto: dataFormateada.total, descripcion: "venta" }, idUsuario, respuestaVenta.idVenta);

  // Retornar respuesta estructurada
  return {
    ok: true,
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

// Funciones específicas
const registrarBoletaVentaService = async (datosVenta, token) => {
  return await registrarVentaBase(datosVenta, token, validarDatosVentaBoleta);
};

const registrarFacturaVentaService = async (datosVenta, token) => {
  return await registrarVentaBase(datosVenta, token, validarDatosVentaFactura);
};

const anularComprobanteService = async (datosAnular, token) => {
  if (!datosAnular || typeof datosAnular != "object") {
    throw Object.assign(
      new Error("Se necesita datos para anular un comprobante."),
      { status: 400 }
    );
  }
  const { idComprobante, motivo } = datosAnular;
  if (!idComprobante || typeof idComprobante !== "number") {
    throw Object.assign(
      new Error("El comprobante es obligatorio."),
      { status: 400 }
    );
  }
  if (!motivo || typeof motivo !== "string" || !motivo.trim()) {
    throw Object.assign(
      new Error("El comprobante es obligatorio."),
      { status: 400 }
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const idUsuario = decodedToken.idUsuario;

  const comprobante = await obtenerComprobantePorIdModel(idComprobante);

  datosEnviar = {
    operacion: "generar_anulacion",
    tipo_de_comprobante: comprobante.idTipoComprobante,
    serie: comprobante.serie,
    numero: comprobante.numeroCorrelativo,
    motivo: motivo
  };
  const respuestaNubefact = await generarComprobanteNubefact(datosEnviar);
  if (respuestaNubefact.error || respuestaNubefact.codigo) {
    return {
      ok: false,
      error: "Error en Nubefact",
      detalles: respuestaNubefact
    };
  }
  const dataActualizar = {
    idComprobante,
    enlaceNubefact: respuestaNubefact.enlace,
    urlComprobanteXML: respuestaNubefact.enlace_del_xml,
    keyNubefact: respuestaNubefact.key,
    aceptadaPorSunat: respuestaNubefact.aceptada_por_sunat ? 1 : 0,
    estadoSunat: respuestaNubefact.sunat_note || respuestaNubefact.sunat_description || null,
    sunatResponseCode: respuestaNubefact.sunat_responsecode
  };
  const respuestaActualizacion = await actualizarComprobanteAnuladoModel(dataActualizar);

  const resultado = await restaurarCajaStock(idComprobante, idUsuario);

  resultado.enlaceNubefact = respuestaNubefact.enlace;
  
  resultado.comprobante = respuestaActualizacion;

  return resultado;

}


module.exports = {
  registrarBoletaVentaService,
  registrarFacturaVentaService,
  anularComprobanteService
};