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

//ruta para obtener los tipos de documento
router.get("/tipos-documentos", listarTipoDocumentoController);

router.get("/top-productos", topProductosMasVendidosController);
router.get("/ingresos-egresos", obtenerResumenVentasEgresosMensualController);
router.get("/comparacion-ventas", obtenerVentasHoyComparacionController);
router.get("/cantidad-ventas", obtenerCantidadVentasHoyComparacionController);
router.get("/cantidad-reservaciones",obtenerReservasHoyComparacionController);
router.get("/balance-anual", obtenerBalanceGeneralAnualController);
router.get("/porcentaje-medios-pago", obtenerPorcentajeMediosPagoController);
router.get("/ventas-mes", obtenerVentasPorMesController);

module.exports = router;