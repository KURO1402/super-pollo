const express = require('express');
// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
// Importamos las rutas de reservaciones
const { obtenerReservacionService, insertarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js')

const app = express();
app.use(express.json());

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-412908639165268-101313-aaf1c24aeffd6d32165dc5dded689461-2923267294' 
});

const crearPreferencia = async (idReservacion) => {
    // Obtener datos de la reservacion
    const reserva = await obtenerReservacionService(idReservacion);
    if (!reserva) throw new Error("Reservación no encontrada");

    // Crear preferencia Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
        body: {
            items: [{
                title: reserva.producto || "Pollo loco",
                quantity: reserva.cantidadPersonas || 2,
                unit_price: reserva.precio_total || 50
            }],
            back_urls: {
                success: "https://www.google.com/success", /*http://localhost:5173/pago-exitoso",*/
                failure: "https://www.google.com/failure", /*http://localhost:5173/pago-fallido",*/
                pending: "https://www.google.com/pending"  /*http://localhost:5173/pago-pendiente"*/
            },
            auto_return: "approved",
            payment_methods: {
              installments: 2,             // máximo de cuotas
              default_installments: 2,     // cuota por defecto
              excluded_payment_types: [],  // excluir tipos(tarjeta de credito, debito, billeteras digitales)
              excluded_payment_methods: [] // excluir metodos(visa, mastercard, yape)
            }
        }
    });

    // Guardar la preference_id en el pago de la reservación
    await insertarPagoService({
        idReservacion,
        montoTotal: reserva.precio_total || 50,
        montoPagado: 0,
        porcentajePago: 0,
        idTransaccion: result.id,
        estadoPago: "pendiente"
    });

    return { init_point: result.init_point, preference_id: result.id };
};

module.exports = { crearPreferencia };

/* USUARIO DE PRUEBA PARA COMPRAR
    USUARIO: TESTUSER5327885063936142262 
    CONTRASEÑA: a1aIwpG1bk */