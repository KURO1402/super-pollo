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
const { autenticacionToken, verificarRoles } = require("../../../middlewares/autenticacionMiddleware");

const router = express.Router();

// Registrar una nueva venta
router.post("/generar-boleta", autenticacionToken, verificarRoles(1,2), registrarBoletaVentaController);
router.post("/generar-factura", autenticacionToken, verificarRoles(1,2), registrarFacturaVentaController);
router.post("/anular-comprobante", autenticacionToken, verificarRoles(1,2), anularComprobanteController);
// Obtener resumen de todas las ventas (paginado)
router.get("/resumen", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasController);
// Obtener ventas por rango de fechas (paginado)
router.get("/resumen/rango-fechas", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorRangoFechaController);
// Obtener ventas por nombre de usuario (paginado)
router.get("/resumen/usuario", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorNombreUsuarioController);
// Obtener ventas por comprobante (serie o número) (paginado)
router.get("/resumen/comprobante", autenticacionToken, verificarRoles(1,2), obtenerVentasPorComprobanteController);
// Obtener ventas por estado de aceptación SUNAT (paginado)
router.get("/resumen/sunat", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorAceptacionSunatController);
// Obtener detalle de una venta por ID
router.get("/resumen/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerResumenVentaPorIdController);
router.get("/detalle-venta/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerDetalleVentaPorIdVentaController);
router.get("/comprobante/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerComprobantePorIdVentaController);

router.get("/estados-sunat", autenticacionToken, verificarRoles(1,2), obtenerEstadosSunatController);
router.get("/medios-pago", autenticacionToken, verificarRoles(1,2), obtenerMediosPagoController);

module.exports = router;