const express = require('express');
const router = express.Router();
const { actualizarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js');
const { MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

router.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

router.post('/', async (req, res) => {
  try {
    const evento = req.body;

    if (evento.type === 'payment' && evento.data && evento.data.id) {
      const paymentId = evento.data.id;

      const payment = await new Payment(client).get({ id: paymentId });

      const estado = payment.status; 
      const idTransaccion = payment.id;

      await actualizarPagoService({
        idTransaccion,
        estadoPago: estado
      });

      console.log(`Pago ${idTransaccion} actualizado a: ${estado}`);
    }

    res.sendStatus(200); 
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
