const { crearCajaService, cerrarCajaService } = require('./cajaServicio');

const crearCajaController = async (req, res) => {
  try {
    const resultado = await crearCajaService(req.body);
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
    try {
        const resultado = await cerrarCajaService(req.body);  

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

module.exports = { crearCajaController, cerrarCajaController };