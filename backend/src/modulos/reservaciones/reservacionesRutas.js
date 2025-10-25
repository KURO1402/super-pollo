const express = require("express");
// importamos los controladores
const {
    insertarReservacionController,
    listarReservacionesController,
    obtenerReservacionController,
    actualizarReservacionController,
    insertarPagoController,
    obtenerPagoController,
    insertarDetalleReservacionController,
    obtenerDetalleReservacionController
} = require("./reservacionesControlador.js")
// importamos mercadoPago.js
const { crearPreferencia } = require('../../servicios/mercadoPago.js');
// importamos el webhook de Mercado Pago
const mercadoPagoWebhook = require('../../servicios/mercadoPagoWebhook.js');

// creamos el enrutador
const router = express.Router();

// ruta para insertar una reservacion
router.post("/", insertarReservacionController);
// ruta para listar reservacions por pagina
router.get("/", listarReservacionesController);
// ruta para obtener una reservacion por id
router.get("/:id", obtenerReservacionController);
// ruta para actualizar una reservacion
router.put("/:id", actualizarReservacionController);
// ruta para insertar un pago de reservacion
router.post("/pago", insertarPagoController);
// ruta para obtener pago de reservacion por id
router.get("/:idReservacion/pago", obtenerPagoController);
// ruta para insertar detalle de reservacion
router.post("/detalle", insertarDetalleReservacionController);
// ruta para obtener detalle de una reservacion por id
router.get("/:idReservacion/detalle", obtenerDetalleReservacionController);

// ruta para crear preferencia de Mercado Pago para una reservación
router.post("/:idReservacion/crear-preferencia", async (req, res) => {
    try {
        const { idReservacion } = req.params;
        const result = await crearPreferencia(idReservacion);
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: err.message });
    }
});

// ruta para recibir notificaciones del webhook de Mercado Pago
router.use("/mercadopago/webhook", mercadoPagoWebhook);

// exportamos el enrutador
module.exports = router;