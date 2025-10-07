const express = require("express");
const {
  registrarVentaController,
  obtenerVentaController,
  obtenerVentaIDController
} = require("../controlador/ventasControlador");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-venta", registrarVentaController);

// Obtener todas las ventas (con paginación)
router.get("/", obtenerVentaController);

// Obtener una venta específica por ID
router.get("/venta-id/:id", obtenerVentaIDController);

module.exports = router;