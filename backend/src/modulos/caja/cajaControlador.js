const { crearCajaService, cerrarCajaService, registrarIngresoCajaService, registrarEgresoCajaService, registrarArqueoCajaService } = require('./cajaServicio');

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

module.exports = { crearCajaController, cerrarCajaController, registrarIngresoCajaController, registrarEgresoCajaController, registrarArqueoCajaController };