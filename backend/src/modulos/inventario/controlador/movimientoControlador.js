//importamos los servicios
const {
  registrarMovimientoService,
  listarMovimientosService,
  obtenerMovimientosPorInsumoService,
  eliminarMovimientoService
} = require("../servicio/movimientoServicio");

// registrar movimiento
const registrarMovimientoController = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer token del header Authorization
  if (!token) {
    return res.status(401).json({ ok: false, mensaje: "Token no proporcionado" });
  }

  try {
    // Pasamos body y token al servicio
    const resultado = await registrarMovimientoService(req.body, token);
    return res.status(201).json({ ok: true, ...resultado });
  } catch (error) {
    return res.status(error.status || 500).json({ 
      ok: false, 
      mensaje: error.mensaje || error.message || "Error desconocido" 
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
const eliminarMovimientoController = async(req, res) => {
  try {
    await eliminarMovimientoService(req.params.id);
    res.json({ok: true, mensaje: "Movimiento eliminado con exito"});
  } catch (error) {
    res.status(error.status || 500).json({ok: false, mensaje: error.message})
  }
};

module.exports = {
    registrarMovimientoController,
    listarMovimientosController,
    obtenerMovimientosPorInsumoController,
    eliminarMovimientoController
};