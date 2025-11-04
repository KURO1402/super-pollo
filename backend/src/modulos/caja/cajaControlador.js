const { crearCajaService, cerrarCajaService, registrarIngresoCajaService, registrarEgresoCajaService, registrarArqueoCajaService, obtenerMovimientosPorCajaService, obtenerMovimientosCajaService, obtenerCajasService, obtenerArqueosCajaService, obtenerArqueosPorCajaService } = require('./cajaServicio');

const crearCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  try {
    const resultado = await crearCajaService(req.body, token);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const cerrarCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  try {
    const resultado = await cerrarCajaService(token);

    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarIngresoCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  try {
    const resultado = await registrarIngresoCajaService(req.body, token);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarEgresoCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  try {
    const resultado = await registrarEgresoCajaService(req.body, token);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarArqueoCajaController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    try {
      const resultado = await registrarArqueoCajaService(req.body, token);
      res.status(200).json(resultado);
    } catch (err) {
      const statusCode = err.status || 500;

      return res.status(statusCode).json({
        ok: false,
        mensaje: err.message || "Error interno del servidor",
      });
    }
};

const obtenerMovimientosPorCajaController = async (req, res) => {
    const { idCaja } = req.params;

    try {
        const movimientos = await obtenerMovimientosPorCajaService(idCaja);
        res.status(200).json(movimientos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerMovimientosCajaController = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

    try {
        const movimientos = await obtenerMovimientosCajaService(limit, offset);
        res.status(200).json(movimientos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerCajasController = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

    try {
        const cajas = await obtenerCajasService(limit, offset);
        res.status(200).json(cajas);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerArqueosCajaController = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; 
    const offset = parseInt(req.query.offset) || 0; 

    try {
        const arqueos = await obtenerArqueosCajaService(limit, offset);
        res.status(200).json(arqueos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerArqueosPorCajaController = async (req, res) => {
    const { idCaja } = req.params;

    try {
        const arqueos = await obtenerArqueosPorCajaService(idCaja);
        res.status(200).json(arqueos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

module.exports = { 
  crearCajaController, 
  cerrarCajaController, 
  registrarIngresoCajaController, 
  registrarEgresoCajaController, 
  registrarArqueoCajaController, 
  obtenerMovimientosPorCajaController, 
  obtenerMovimientosCajaController, 
  obtenerCajasController,
  obtenerArqueosCajaController,
  obtenerArqueosPorCajaController
};