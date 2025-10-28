//importamos los servicios
const { buscarMovimientosPorFechaModel } = require("../modelo/movimientosModelo");
const {
  registrarMovimientoStockService,
  obtenerMovimientosPaginacionService,
  buscarMovimientosPorInsumoService,
  buscarMovimientosPorUsuarioService,
  buscarMovimientosPorFechaService,
  buscarMovimientosPorTipoService
} = require("../servicio/movimientoServicio");

// registrar movimiento
const registrarMovimientoStockController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer token del header Authorization
  try {
    // Pasamos body y token al servicio
    const respuesta = await registrarMovimientoStockService(req.body, token);

    return res.status(201).json(respuesta);

  } catch (err) {
    console.error("Error en registrarMovimientoStockController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

const obtenerMovimientosPaginacionController = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const movimientos = await obtenerMovimientosPaginacionService(limit, offset);

    return res.status(200).json(movimientos);

  } catch (err) {
    console.error("Error en obtenerMovimientosPaginacionController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

const buscarMovimientosPorInsumoController = async (req, res) => {
  try {
    const { insumo, limit, offset } = req.query;

    const movimientos = await buscarMovimientosPorInsumoService(insumo, limit, offset);

    return res.status(200).json(movimientos);

  } catch (err) {
    console.error("Error en buscarMovimientosPorInsumoController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

const buscarMovimientosPorUsuarioController = async (req, res) => {
  try {
    const { usuario, limit, offset } = req.query;

    const movimientos = await buscarMovimientosPorUsuarioService(usuario, limit, offset);

    return res.status(200).json(movimientos);

  } catch (err) {
    console.error("Error en buscarMovimientosPorUsuarioController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

const buscarMovimientosPorFechaController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limit, offset } = req.query;

    const movimientos = await buscarMovimientosPorFechaService(fechaInicio, fechaFin, limit, offset);

    return res.status(200).json(movimientos);

  } catch (err) {
    console.error("Error en buscarMovimientosPorFechaController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

const buscarMovimientosPorTipoController = async (req, res) => {
  try {
    const { tipo, limit, offset } = req.query;

    const movimientos = await buscarMovimientosPorTipoService(tipo, limit, offset);

    return res.status(200).json(movimientos);

  } catch (err) {
    console.error("Error en buscarMovimientosPorTipoController:", err.message);
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

module.exports = {
  registrarMovimientoStockController,
  obtenerMovimientosPaginacionController,
  buscarMovimientosPorInsumoController,
  buscarMovimientosPorUsuarioController,
  buscarMovimientosPorFechaController,
  buscarMovimientosPorTipoController
};