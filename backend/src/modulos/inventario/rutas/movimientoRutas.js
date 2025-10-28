const express = require("express");
const router = express.Router();

//Importamos lso controladores
const {
  registrarMovimientoStockController,
  listarMovimientosController,
  obtenerMovimientosPorInsumoController,
  eliminarMovimientoController
} = require("../controlador/movimientoControlador");

//ruta para registrar un movimiento
router.post("/movimiento", registrarMovimientoStockController);

//Ruta para listar todos los movimientos
router.get("/", listarMovimientosController);

//ruta para obtener movimiento especifico
router.get("/:id", obtenerMovimientosPorInsumoController);

// Ruta para eliminar un movimiento
router.delete("/:id", eliminarMovimientoController);

//importamos las rutas
module.exports = router;