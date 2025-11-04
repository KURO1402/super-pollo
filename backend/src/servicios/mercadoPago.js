const { MercadoPagoConfig, Preference } = require('mercadopago');

require('dotenv').config();

const { obtenerDetalleReservacionService, insertarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js')

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const crearPreferencia = async (idReservacion) => {
    const detalles = await obtenerDetalleReservacionService(idReservacion);
    if (!detalles || detalles.length === 0) throw new Error("Reservación no encontrada");

    const montoTotal = detalles.reduce((sum, d) => sum + (d.cantidadProductoReservacion * d.precioUnitario), 0);
    const montoParcial = montoTotal / 2; 

    const items = [{
        title: "Deuda por reservación",
        quantity: 1,
        unit_price: Number(montoParcial)
    }];

    const preference = new Preference(client);
    const result = await preference.create({
        body: {
            items,
            back_urls: {
                success: "https://superpollohyo.com/usuario/pago-exitoso", 
                failure: "https://superpollohyo.com/usuario/pago-fallido", 
                pending: "https://superpollohyo.com/usuario/pago-pendiente"  
            },
            notification_url: "https://superpollohyo.com/reservaciones/mercadopago/webhook",
            auto_return: "approved",
            payment_methods: {
              installments: 1,        
              default_installments: 1,    
              excluded_payment_types: [], 
              excluded_payment_methods: [] 
            }
        }
    });

    await insertarPagoService({
        idReservacion,
        montoTotal,
        montoPagado: montoParcial,
        porcentajePago: 50,
        idTransaccion: result.id,
        estadoPago: "pendiente"
    });

    return { init_point: result.init_point, preference_id: result.id };
};

module.exports = { crearPreferencia };


