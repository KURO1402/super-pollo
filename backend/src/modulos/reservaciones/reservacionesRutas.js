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
  listarMesasDisponiblesController,
  obtenerReservasPorUsuarioController
} = require("./reservacionesControlador.js");

// Importamos Mercado Pago
const { crearPreferencia } = require("../../servicios/mercadoPago.js");

// Importamos el webhook de Mercado Pago
const mercadoPagoWebhook = require("../../servicios/mercadoPagoWebhook.js");

const { autenticacionToken, verificarRoles } = require("../../middlewares/autenticacionMiddleware")

// Creamos el enrutador
const router = express.Router();

// Registrar una reservación 
router.post("/", autenticacionToken, registrarReservacionController);

// Listar reservaciones (paginadas)
router.get("/", autenticacionToken, verificarRoles(1,2), listarReservacionesController);
router.get("/reservas-usuario", autenticacionToken, obtenerReservasPorUsuarioController);

// Obtener una reservación por ID
router.get("/:id", autenticacionToken, verificarRoles(1,2), obtenerReservacionController);

// Actualizar una reservación por ID
router.put("/:id", autenticacionToken, verificarRoles(1,2), actualizarReservacionController);

// Insertar un pago
router.post("/pago", autenticacionToken, insertarPagoController);

// Obtener pago de una reservación
router.get("/:idReservacion/pago", obtenerPagoController);

// Obtener detalles de una reservación
router.get("/:idReservacion/detalle", autenticacionToken, verificarRoles(1,2), obtenerDetalleReservacionController);

// Listar mesas disponibles por fecha y hora (?fecha=YYYY-MM-DD&hora=HH:MM:SS)
router.get("/mesas/disponibles", autenticacionToken, listarMesasDisponiblesController);

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
router.use("/mercadopago/webhook", autenticacionToken, mercadoPagoWebhook);

// Exportamos el enrutador
module.exports = router;
