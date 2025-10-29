// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
// Cargar variable de entorno
require('dotenv').config();
// Importamos las rutas de reservaciones
const { obtenerDetalleReservacionService, insertarPagoService } = require('../modulos/reservaciones/reservacionesServicio.js')

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const crearPreferencia = async (idReservacion) => {
    const detalles = await obtenerDetalleReservacionService(idReservacion);
    if (!detalles || detalles.length === 0) throw new Error("Reservación no encontrada");

    // Calcular monto total
    const montoTotal = detalles.reduce((sum, d) => sum + (d.cantidadProductoReservacion * d.precioUnitario), 0);
    const montoParcial = montoTotal / 2; // solo se paga el 50% en línea

    const items = [{
        title: "Deuda por reservación",
        quantity: 1,
        unit_price: Number(montoParcial)
    }];

    // Crear preferencia Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
        body: {
            items,
            back_urls: {
                success: "https://superpollohyo.com/usuario/pago-exitoso", 
                failure: "https://superpollohyo.com/usuario/pago-fallido", 
                pending: "https://superpollohyo.com/usuario/pago-pendiente"  
            },
            notification_url: "http://localhost:3001/mercadopago/webhook",
            auto_return: "approved",
            payment_methods: {
              installments: 1,             // máximo de cuotas
              default_installments: 1,     // cuota por defecto
              excluded_payment_types: [],  // excluir tipos(tarjeta de credito, debito, billeteras digitales)
              excluded_payment_methods: [] // excluir metodos(visa, mastercard, yape)
            }
        }
    });

    // Guardar la preference_id en el pago de la reservación
    await insertarPagoService({
        idReservacion,
        montoTotal,
        montoPagado: montoParcial,
        porcentajePago: 50,
        idTransaccion: result.id,
        estadoPago: "pendiente"
    });

    // Retornar la URL de pago
    return { init_point: result.init_point, preference_id: result.id };
};

module.exports = { crearPreferencia };


