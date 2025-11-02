const express = require("express");
const {
  registrarBoletaVentaController,
  registrarFacturaVentaController,
  anularComprobanteController,
  obtenerResumenVentasController,
  obtenerResumenVentaPorIdController,
  obtenerResumenVentasPorRangoFechaController,
  obtenerResumenVentasPorNombreUsuarioController,
  obtenerVentasPorComprobanteController,
  obtenerResumenVentasPorAceptacionSunatController,
  obtenerEstadosSunatController,
  obtenerMediosPagoController,
  obtenerDetalleVentaPorIdVentaController,
  obtenerComprobantePorIdVentaController
} = require("../controlador/ventasControlador");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-boleta", registrarBoletaVentaController);
router.post("/generar-factura", registrarFacturaVentaController);
router.post("/anular-comprobante", anularComprobanteController);
// Obtener resumen de todas las ventas (paginado)
router.get("/resumen", obtenerResumenVentasController);
// Obtener ventas por rango de fechas (paginado)
router.get("/resumen/rango-fechas", obtenerResumenVentasPorRangoFechaController);
// Obtener ventas por nombre de usuario (paginado)
router.get("/resumen/usuario", obtenerResumenVentasPorNombreUsuarioController);
// Obtener ventas por comprobante (serie o número) (paginado)
router.get("/resumen/comprobante", obtenerVentasPorComprobanteController);
// Obtener ventas por estado de aceptación SUNAT (paginado)
router.get("/resumen/sunat", obtenerResumenVentasPorAceptacionSunatController);
// Obtener detalle de una venta por ID
router.get("/resumen/:idVenta", obtenerResumenVentaPorIdController);
router.get("/detalle-venta/:idVenta", obtenerDetalleVentaPorIdVentaController);
router.get("/comprobante/:idVenta", obtenerComprobantePorIdVentaController);

router.get("/estados-sunat", obtenerEstadosSunatController);
router.get("/medios-pago", obtenerMediosPagoController);

module.exports = router;