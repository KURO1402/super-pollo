const express = require("express");
const {
  registrarBoletaVentaController,
  obtenerVentaController,
  obtenerVentaIDController
} = require("../controlador/ventasControlador");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-boleta", registrarBoletaVentaController);

// Obtener todas las ventas (con paginación)
router.get("/", obtenerVentaController);

// Obtener una venta específica por ID
router.get("/venta-id/:id", obtenerVentaIDController);

module.exports = router;