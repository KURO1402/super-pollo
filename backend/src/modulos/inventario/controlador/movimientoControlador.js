//importamos los servicios
const {
  registrarMovimientoStockService,
  listarMovimientosService,
  obtenerMovimientosPorInsumoService,
  eliminarMovimientoService
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


// Listar todos los movimientos
const listarMovimientosController = async (req, res) => {
  try {
    const movimientos = await listarMovimientosService();
    return res.json({ ok: true, total: movimientos.length, data: movimientos });
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || error.message || "Error desconocido" });
  }
};

// Obtener movimientos por insumo
const obtenerMovimientosPorInsumoController = async (req, res) => {
  try {
    const idInsumo = req.params.id;
    const movimientos = await obtenerMovimientosPorInsumoService(idInsumo);
    return res.json({ ok: true, data: movimientos });
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || error.message || "Error desconocido" });
  }
};

//Eliminar movimientos
const eliminarMovimientoController = async (req, res) => {
  try {
    await eliminarMovimientoService(req.params.id);
    res.json({ ok: true, mensaje: "Movimiento eliminado con exito" });
  } catch (error) {
    res.status(error.status || 500).json({ ok: false, mensaje: error.message })
  }
};

module.exports = {
  registrarMovimientoStockController,
  listarMovimientosController,
  obtenerMovimientosPorInsumoController,
  eliminarMovimientoController
};