const express = require("express");
const {
  registrarVentasController,
  obtenerVentasController,
  obtenerVentasIDController
} = require("./ventaControlador");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-venta", registrarVentasController);

// Obtener todas las ventas (con paginación)
router.get("/", obtenerVentasController);

// Obtener una venta específica por ID
router.get("/:id", obtenerVentasIDController);

module.exports = router;