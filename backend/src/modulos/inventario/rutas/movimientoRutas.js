const express = require("express");
const router = express.Router();

const {
  registrarMovimientoStockController,
  obtenerMovimientosPaginacionController,
  buscarMovimientosPorInsumoController,
  buscarMovimientosPorUsuarioController,
  buscarMovimientosPorFechaController,
  buscarMovimientosPorTipoController

} = require("../controlador/movimientoControlador");

const { autenticacionToken, verificarRoles } = require("../../../middlewares/autenticacionMiddleware");

router.post("/movimiento", autenticacionToken, verificarRoles(1, 2), registrarMovimientoStockController);

router.get("/movimientos", autenticacionToken, verificarRoles(1, 2), async (req, res, next) => {
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

    return obtenerMovimientosPaginacionController(req, res);

  } catch (err) {
    next(err);
  }
});

module.exports = router;