const express = require("express");

// Importamos los controladores actualizados
const {
  registrarReservacionController,
  listarReservacionesController,
  obtenerReservacionController,
  actualizarReservacionController,
  insertarPagoController,
  obtenerPagoController,
  obtenerDetalleReservacionController,
  listarMesasDisponiblesController
} = require("./reservacionesControlador.js");

// Importamos Mercado Pago
const { crearPreferencia } = require("../../servicios/mercadoPago.js");

// Importamos el webhook de Mercado Pago
const mercadoPagoWebhook = require("../../servicios/mercadoPagoWebhook.js");

const { autenticacionToken } = require("../../middlewares/autenticacionMiddleware");

// Creamos el enrutador
const router = express.Router();

// Registrar una reservación 
router.post("/", registrarReservacionController);

// Listar reservaciones (paginadas)
router.get("/", listarReservacionesController);

// Obtener una reservación por ID
router.get("/:id", obtenerReservacionController);

// Actualizar una reservación por ID
router.put("/:id", actualizarReservacionController);

// Insertar un pago
router.post("/pago", autenticacionToken, insertarPagoController);

// Obtener pago de una reservación
router.get("/:idReservacion/pago", obtenerPagoController);

// Obtener detalles de una reservación
router.get("/:idReservacion/detalle", obtenerDetalleReservacionController);

// Listar mesas disponibles por fecha y hora (?fecha=YYYY-MM-DD&hora=HH:MM:SS)
router.get("/mesas/disponibles", listarMesasDisponiblesController);

// Crear preferencia de Mercado Pago para una reservación
router.post("/:idReservacion/crear-preferencia", autenticacionToken, async (req, res) => {
  try {
    const { idReservacion } = req.params;
    const { idUsuario } = req.usuario; 
    const result = await crearPreferencia(idReservacion, idUsuario);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("Error al crear preferencia de Mercado Pago:", err);
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// Webhook de Mercado Pago (para recibir notificaciones)
router.use("/mercadopago/webhook", mercadoPagoWebhook);

// Exportamos el enrutador
module.exports = router;
