const { 
  listarTipoDocumentoService,
  topProductosMasVendidosService,
  obtenerResumenVentasEgresosMensualService,
  obtenerVentasHoyComparacionService,
  obtenerCantidadVentasHoyComparacionService,
  obtenerReservasHoyComparacionService,
  obtenerBalanceGeneralAnualService,
  obtenerPorcentajeMediosPagoService,
  obtenerVentasPorMesService 
} = require("./fuenteDatosServicio.js");

const listarTipoDocumentoController = async (req, res) => {
  try {
    const tiposDoc = await listarTipoDocumentoService();

    return res.status(200).json({
      ok: true,
      tiposDoc,
    });

  } catch (err) {

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const topProductosMasVendidosController = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const resultado = await topProductosMasVendidosService(fechaInicio, fechaFin);

        return res.status(200).json(resultado);

    } catch (err) {
        return res.status(err.status || 500).json({
            ok: false,
            mensaje: err.message || "Error interno en el servidor"
        });
    }
};

const obtenerResumenVentasEgresosMensualController = async (req, res) => {
  try {
    const { meses } = req.query;

    const resultado = await obtenerResumenVentasEgresosMensualService(meses);

    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener resumen de ventas y egresos"
    });
  }
};

const obtenerVentasHoyComparacionController = async (req, res) => {
  try {
    const resultado = await obtenerVentasHoyComparacionService();

    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener ventas de hoy y comparación"
    });
  }
};

const obtenerCantidadVentasHoyComparacionController = async (req, res) => {
  try {
    const resultado = await obtenerCantidadVentasHoyComparacionService();

    res.status(200).json(resultado); 
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener cantidad de ventas de hoy y comparación"
    });
  }
};

const obtenerReservasHoyComparacionController = async (req, res) => {
  try {
    const resultado = await obtenerReservasHoyComparacionService();
    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener reservas de hoy y comparación"
    });
  }
};

const obtenerBalanceGeneralAnualController = async (req, res) => {
  try {
    const resultado = await obtenerBalanceGeneralAnualService();
    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener el balance general anual"
    });
  }
};

const obtenerPorcentajeMediosPagoController = async (req, res) => {
  try {
    const resultado = await obtenerPorcentajeMediosPagoService();
    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener porcentaje de medios de pago"
    });
  }
};

const obtenerVentasPorMesController = async (req, res) => {
  try {
    const { meses } = req.query; 

    const resultado = await obtenerVentasPorMesService(meses);

    res.status(200).json(resultado);
  } catch (err) {
    res.status(err.status || 500).json({
      ok: false,
      mensaje: err.message || "Error al obtener ventas por mes"
    });
  }
};

module.exports = { 
  listarTipoDocumentoController,
  topProductosMasVendidosController,
  obtenerResumenVentasEgresosMensualController,
  obtenerVentasHoyComparacionController,
  obtenerCantidadVentasHoyComparacionController,
  obtenerReservasHoyComparacionController,
  obtenerBalanceGeneralAnualController,
  obtenerPorcentajeMediosPagoController,
  obtenerVentasPorMesController 
};
