const express = require("express");
const router = express.Router();

//Importamos lso controladores
const {
    registrarMovimientoController,
  listarMovimientosController,
  obtenerMovimientosPorInsumoController,
} = require("../controlador/movimientoControlador");

//ruta para registrar un movimiento
router.post("/registrar", registrarMovimientoController);

//Ruta para listar todos los movimientos
router.get("/", listarMovimientosController);

//ruta para obtener movimiento especifico
router.get("/:id", obtenerMovimientosPorInsumoController);

//importamos las rutas
module.exports = router;