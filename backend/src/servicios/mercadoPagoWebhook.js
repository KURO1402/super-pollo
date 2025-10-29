const express = require('express');
const router = express.Router();
const { actualizarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js');
const { MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

// Middleware para parsear JSON
router.use(express.json());

// Configura el cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Ruta del webhook
router.post('/', async (req, res) => {
  try {
    const evento = req.body;

    if (evento.type === 'payment' && evento.data && evento.data.id) {
      const paymentId = evento.data.id;

      // Obtener detalles del pago desde Mercado Pago
      const payment = await new Payment(client).get({ id: paymentId });

      // Extraer datos importantes
      const estado = payment.status; // "approved", "pending", "rejected"
      const idTransaccion = payment.id;

      // Actualizar el estado del pago en la db
      await actualizarPagoService({
        idTransaccion,
        estadoPago: estado
      });

      console.log(`Pago ${idTransaccion} actualizado a: ${estado}`);
    }

    res.sendStatus(200); // Confirmar recepción
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
