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

router.post("/generar-boleta", autenticacionToken, verificarRoles(1,2), registrarBoletaVentaController);
router.post("/generar-factura", autenticacionToken, verificarRoles(1,2), registrarFacturaVentaController);
router.post("/anular-comprobante", autenticacionToken, verificarRoles(1,2), anularComprobanteController);

router.get("/resumen", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasController);

router.get("/resumen/rango-fechas", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorRangoFechaController);

router.get("/resumen/usuario", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorNombreUsuarioController);

router.get("/resumen/comprobante", autenticacionToken, verificarRoles(1,2), obtenerVentasPorComprobanteController);

router.get("/resumen/sunat", autenticacionToken, verificarRoles(1,2), obtenerResumenVentasPorAceptacionSunatController);

router.get("/resumen/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerResumenVentaPorIdController);
router.get("/detalle-venta/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerDetalleVentaPorIdVentaController);
router.get("/comprobante/:idVenta", autenticacionToken, verificarRoles(1,2), obtenerComprobantePorIdVentaController);

router.get("/estados-sunat", autenticacionToken, verificarRoles(1,2), obtenerEstadosSunatController);
router.get("/medios-pago", autenticacionToken, verificarRoles(1,2), obtenerMediosPagoController);

module.exports = router;