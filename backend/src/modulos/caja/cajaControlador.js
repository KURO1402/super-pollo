const { crearCajaService, cerrarCajaService, registrarIngresoCajaService, registrarEgresoCajaService, registrarArqueoCajaService, obtenerMovimientosPorCajaService, obtenerUltimosMovimientosCajaService, obtenerCajasCerradasService } = require('./cajaServicio');

const crearCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization
  try {
    const resultado = await crearCajaService(req.body.montoInicial, token);
    res.status(200).json(resultado);
  } catch (err) {
    // Manejo centralizado de errores
    console.error("Error en crearCajaController:", err.message);

    // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

// Controlador para cerrar caja
const cerrarCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization
  try {
    const resultado = await cerrarCajaService(token);

    res.status(200).json(resultado);
  } catch (err) {
    // Manejo centralizado de errores
    console.error("Error en cerrarCajaController:", err.message);

    // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

//Controlador para registrar ingreso en caja
const registrarIngresoCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization
  try {
    const resultado = await registrarIngresoCajaService(req.body, token);
    res.status(200).json(resultado);
  } catch (err) {
    // Manejo centralizado de errores
    console.error("Error en registrarIngresoCajaController:", err.message);

    // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

//Controlador para registrar egreso en caja
const registrarEgresoCajaController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization
  try {
    const resultado = await registrarEgresoCajaService(req.body, token);
    res.status(200).json(resultado);
  } catch (err) {
    // Manejo centralizado de errores
    console.error("Error en registrarEgresoCajaController:", err.message);

    // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

// Controlador para registrar arqueo de caja
const registrarArqueoCajaController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization
    try {
      const resultado = await registrarArqueoCajaService(req.body, token);
      res.status(200).json(resultado);
    } catch (err) {
      // Manejo centralizado de errores
      console.error("Error en registrarArqueoCajaController:", err.message);

      // Determinar código de estado (usar 500 por defecto si no está especificado)
      const statusCode = err.status || 500;

      return res.status(statusCode).json({
        ok: false,
        mensaje: err.message || "Error interno del servidor",
      });
    }
};

// Controlador para obtener los movimientos de una caja específica
const obtenerMovimientosPorCajaController = async (req, res) => {
    const { idCaja } = req.params;

    try {
        const movimientos = await obtenerMovimientosPorCajaService(idCaja);
        res.status(200).json(movimientos);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en obtenerMovimientosPorCajaController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

// Controlador para obtener los últimos movimientos de caja (10 en 10)
const obtenerUltimosMovimientosCajaController = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Número de registros por página, por defecto 10
    const offset = parseInt(req.query.offset) || 0; // Desplazamiento para la paginación, por defecto 0

    try {
        const movimientos = await obtenerUltimosMovimientosCajaService(limit, offset);
        res.status(200).json(movimientos);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en obtenerUltimosMovimientosCajaController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

// Controlador para obtener las cajas cerradas (10 en 10)
const obtenerCajasCerradasController = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Número de registros por página, por defecto 10
    const offset = parseInt(req.query.offset) || 0; // Desplazamiento para la paginación, por defecto 0

    try {
        const cajas = await obtenerCajasCerradasService(limit, offset);
        res.status(200).json(cajas);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en obtenerCajasCerradasController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
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
  obtenerUltimosMovimientosCajaController, 
  obtenerCajasCerradasController,
 obtenerCajasCerradasController
};