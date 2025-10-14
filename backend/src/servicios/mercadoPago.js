const express = require('express');
// SDK de Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-412908639165268-101313-aaf1c24aeffd6d32165dc5dded689461-2923267294' 
});

app.post('/crear-preferencia', async (req, res) => {
  const preference = new Preference(client);

  try {
    const result = await preference.create({
        body: {
            items: [
              {
                title: req.body.titulo,
                quantity: Number(req.body.cantidad),
                unit_price: Number(req.body.precio)
              }
            ],
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

    res.json({
      id: result.id,
      init_point: result.init_point
    });
  } catch (error) {
    if (error.response) {
        console.error("Error Mercado Pago - Status:", error.response.status);
        console.error("Error Mercado Pago - Data:", error.response.data);
        // Retornamos el error para que el servicio lo maneje
        res.status(error.response.status).json(error.response.data);
    } else {
        console.error("Error de conexión:", error.message);
        res.status(500).json({ error: "Error de conexión con Mercado Pago" });
    }
  }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ✅');
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


/* USUARIO DE PRUEBA PARA COMPRAR
    USUARIO: TESTUSER5327885063936142262 
    CONTRASEÑA: a1aIwpG1bk */