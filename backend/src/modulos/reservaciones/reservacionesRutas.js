const express = require("express");

const {
  registrarReservacionController,
  listarMesasDisponiblesController
} = require("./reservacionesControlador.js");

//const { crearPreferencia } = require("../../servicios/mercadoPago.js");

//const mercadoPagoWebhook = require("../../servicios/mercadoPagoWebhook.js");

const { autenticacionToken, verificarRoles } = require("../../middlewares/autenticacionMiddleware")

const router = express.Router();

router.post("/registrar-reservacion", autenticacionToken, registrarReservacionController);

router.get("/mesas-disponibles", autenticacionToken, listarMesasDisponiblesController);
/*router.get("/reservas-usuario", autenticacionToken, obtenerReservasPorUsuarioController);

router.get("/:id", autenticacionToken, verificarRoles(1,2), obtenerReservacionController);

router.put("/:id", autenticacionToken, verificarRoles(1,2), actualizarReservacionController);

router.post("/pago", autenticacionToken, insertarPagoController);

router.get("/:idReservacion/pago", obtenerPagoController);

router.get("/:idReservacion/detalle", autenticacionToken, verificarRoles(1,2), obtenerDetalleReservacionController);

router.get("/mesas/disponibles", autenticacionToken, listarMesasDisponiblesController);

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

router.use("/mercadopago/webhook", autenticacionToken, mercadoPagoWebhook);*/

module.exports = router;
