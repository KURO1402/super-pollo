//importamos los servicios
const {
  registrarMovimientoService,
  listarMovimientosService,
  obtenerMovimientosPorInsumoService,
} = require("../servicio/movimientoServicio");

// registrar movimiento
const registrarMovimientoController = async (req, res) => {
    try {
        //llamamos al servicio con los datos del request body
        const resultado = await registrarMovimientoService(req.body);
        return res.status(201).json({ ok: true, ...resultado});
    } catch (error) {
        return res.status(error.status || 500).json({ ok: false, mensaje: error.mensaje || error.message || "Error desconocido" });
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

module.exports = {
    registrarMovimientoController,
    listarMovimientosController,
    obtenerMovimientosPorInsumoController,
};