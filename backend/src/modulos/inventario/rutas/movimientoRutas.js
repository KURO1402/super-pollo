const express = require("express");
const router = express.Router();

//Importamos lso controladores
const {
  registrarMovimientoStockController,
  obtenerMovimientosPaginacionController,
  buscarMovimientosPorInsumoController,
  buscarMovimientosPorUsuarioController,
  buscarMovimientosPorFechaController,
  buscarMovimientosPorTipoController

} = require("../controlador/movimientoControlador");

//ruta para registrar un movimiento
router.post("/movimiento", registrarMovimientoStockController);

router.get("/movimientos", async (req, res, next) => {
  try {
    const { insumo, usuario, fechaInicio, fechaFin, tipo } = req.query;

    if (insumo) {
      return buscarMovimientosPorInsumoController(req, res);
    } 
    if (usuario) {
      return buscarMovimientosPorUsuarioController(req, res);
    } 
    if (fechaInicio && fechaFin) {
      return buscarMovimientosPorFechaController(req, res);
    } 
    if (tipo) {
      return buscarMovimientosPorTipoController(req, res);
    }

    // Si no hay filtros, devuelve todos los movimientos paginados
    return obtenerMovimientosPaginacionController(req, res);

  } catch (err) {
    next(err);
  }
});

//importamos las rutas
module.exports = router;