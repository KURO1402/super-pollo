const express = require("express");
const {
  registrarBoletaVentaController,
  registrarFacturaVentaController,
  obtenerVentaController,
  obtenerVentaIDController,
  anularComprobanteController
} = require("../controlador/ventasControlador");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-boleta", registrarBoletaVentaController);
router.post("/generar-factura", registrarFacturaVentaController);
router.post("/anular-comprobante", anularComprobanteController);

module.exports = router;