const express = require("express");
const { 
    listarTipoDocumentoController, 
    topProductosMasVendidosController,
    obtenerResumenVentasEgresosMensualController,
    obtenerVentasHoyComparacionController,
    obtenerCantidadVentasHoyComparacionController,
    obtenerReservasHoyComparacionController,
    obtenerBalanceGeneralAnualController,
    obtenerPorcentajeMediosPagoController,
    obtenerVentasPorMesController  
} = require("./fuenteDatosControlador.js")

const router = express.Router();
const { autenticacionToken, verificarRoles } = require("../../middlewares/autenticacionMiddleware");

router.get("/tipos-documentos", listarTipoDocumentoController);

router.get("/top-productos", autenticacionToken, verificarRoles(1), topProductosMasVendidosController);
router.get("/ingresos-egresos",autenticacionToken, verificarRoles(1), obtenerResumenVentasEgresosMensualController);
router.get("/comparacion-ventas", autenticacionToken, verificarRoles(1), obtenerVentasHoyComparacionController);
router.get("/cantidad-ventas",autenticacionToken, verificarRoles(1), obtenerCantidadVentasHoyComparacionController);
router.get("/cantidad-reservaciones", autenticacionToken, verificarRoles(1),obtenerReservasHoyComparacionController);
router.get("/balance-anual", autenticacionToken, verificarRoles(1), obtenerBalanceGeneralAnualController);
router.get("/porcentaje-medios-pago", autenticacionToken, verificarRoles(1), obtenerPorcentajeMediosPagoController);
router.get("/ventas-mes", autenticacionToken, verificarRoles(1), obtenerVentasPorMesController);

module.exports = router;