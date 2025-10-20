const express = require('express');
// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
// Importamos las rutas de reservaciones
const { obtenerDetalleReservacionService, insertarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js')

const app = express();
app.use(express.json());

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-412908639165268-101313-aaf1c24aeffd6d32165dc5dded689461-2923267294' 
});

const crearPreferencia = async (idReservacion) => {
    const detalles = await obtenerDetalleReservacionService(idReservacion);
    if (!detalles || detalles.length === 0) throw new Error("No hay detalles para esta reservación");

    const items = detalles.map(d => ({
        title: d.producto,
        quantity: Number(d.cantidadProductoReservacion),
        unit_price: Number(d.precioUnitario)
    }));

    // Crear preferencia Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
        body: {
            items,
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

    // Calcular monto total
    const montoTotal = detalles.reduce((sum, d) => sum + (d.cantidadProductoReservacion * d.precioUnitario), 0);

    // Guardar la preference_id en el pago de la reservación
    await insertarPagoService({
        idReservacion,
        montoTotal,
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