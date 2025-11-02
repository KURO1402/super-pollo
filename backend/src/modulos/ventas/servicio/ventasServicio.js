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
  actualizarComprobanteAnuladoModel,
  obtenerResumenVentasModel,
  obtenerResumenVentaPorIdModel,
  obtenerResumenVentasPorRangoFechaModel,
  obtenerResumenVentasPorNombreUsuarioModel,
  obtenerVentasPorComprobanteModel,
  obtenerResumenVentasPorAceptacionSunatModel,
  obtenerEstadosSunatModel,
  obtenerMediosPagoModel,
  obtenerDetalleVentaPorIdVentaModel,
  obtenerComprobantePorIdVentaModel
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

const obtenerResumenVentasService = async (limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const ventas = await obtenerResumenVentasModel(limite, desplazamiento);

  if (ventas.length === 0) {
    throw Object.assign(new Error("No se encontraron ventas"), { status: 404 });
  }

  return ventas;
};

const obtenerResumenVentaPorIdService = async (idVenta) => {
  if (!idVenta || isNaN(Number(idVenta))) {
    throw Object.assign(
      new Error("Se requiere un ID de venta valido."),
      { status: 400 }
    );
  }
  const venta = await obtenerResumenVentaPorIdModel(idVenta);

  if (!venta) {
    throw Object.assign(new Error("Venta no encontrada"), { status: 404 });
  }

  return venta;
};

const obtenerResumenVentasPorRangoFechaService = async (fechaInicio, fechaFin, limit, offset) => {
  if (!fechaInicio || !fechaFin) {
    throw Object.assign(
      new Error("Debe proporcionar fechaInicio y fechaFin para filtrar las ventas"),
      { status: 400 }
    );
  }
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const ventas = await obtenerResumenVentasPorRangoFechaModel(fechaInicio, fechaFin, limite, desplazamiento);

  if (ventas.length === 0) {
    throw Object.assign(new Error("No se encontraron ventas en el rango de fechas"), { status: 404 });
  }

  return ventas;
};


const obtenerResumenVentasPorNombreUsuarioService = async (busqueda, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const ventas = await obtenerResumenVentasPorNombreUsuarioModel(busqueda, limite, desplazamiento);

  if (ventas.length === 0) {
    throw Object.assign(new Error("No se encontraron ventas bajo ese usuario"), { status: 404 });
  }

  return ventas;
};

const obtenerVentasPorComprobanteService = async (busqueda, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const ventas = await obtenerVentasPorComprobanteModel(busqueda, limite, desplazamiento);

  if (ventas.length === 0) {
    throw Object.assign(new Error("No se encontraron coincidencias con ese comprobante"), { status: 404 });
  }

  return ventas;
};


const obtenerResumenVentasPorAceptacionSunatService = async (aceptadaSunat, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const ventas = await obtenerResumenVentasPorAceptacionSunatModel(aceptadaSunat, limite, desplazamiento);

  if (ventas.length === 0) {
    throw Object.assign(new Error("No se encontraron ventas con ese estado SUNAT"), { status: 404 });
  }

  return ventas;
};

const obtenerEstadosSunatService = async () => {

  const estados = await obtenerEstadosSunatModel();

  if (estados.length === 0) {
    throw Object.assign(new Error("No se encontraron estados de SUNAT."), { status: 404 });
  }

  return estados;
};

const obtenerMediosPagoService = async () => {
    const medios = await obtenerMediosPagoModel();

    if (medios.length === 0) {
        throw Object.assign(
            new Error("No se encontraron medios de pago registrados"),
            { status: 404 }
        );
    }

    return medios;
};

const obtenerDetalleVentaPorIdVentaService = async (idVenta) => {
  if (!idVenta) {
    throw Object.assign(new Error("El idVenta es obligatorio"), { status: 400 });
  }

  const detalle = await obtenerDetalleVentaPorIdVentaModel(idVenta);

  if (detalle.length === 0) {
    throw Object.assign(new Error("No se encontraron detalles para esta venta"), {
      status: 404
    });
  }

  return detalle;
};

const obtenerComprobantePorIdVentaService = async (idVenta) => {
  if (!idVenta) {
    throw Object.assign(new Error("El idVenta es obligatorio"), { status: 400 });
  }

  const comprobante = await obtenerComprobantePorIdVentaModel(idVenta);

  if (comprobante.length === 0) {
    throw Object.assign(new Error("No existe comprobante para esta venta"), {
      status: 404
    });
  }

  return comprobante;
};

module.exports = {
  registrarBoletaVentaService,
  registrarFacturaVentaService,
  anularComprobanteService,
  obtenerResumenVentasService,
  obtenerResumenVentaPorIdService,
  obtenerResumenVentasPorRangoFechaService,
  obtenerResumenVentasPorNombreUsuarioService,
  obtenerVentasPorComprobanteService,
  obtenerResumenVentasPorAceptacionSunatService,
  obtenerEstadosSunatService,
  obtenerMediosPagoService,
  obtenerDetalleVentaPorIdVentaService,
  obtenerComprobantePorIdVentaService 
};