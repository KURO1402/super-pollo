require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

//rutas del modulo de autenticacion
const autenticacionRoutes = require("./src/modulos/autenticacion/autenticacionRutas.js");

//rutas del modulo de fuente de datos
const fuenteDatosRouter = require("./src/modulos/fuenteDatos/fuenteDatosRutas.js")

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',  // el origen específico permitido
  credentials: true,                 // permite el envío de cookies y credenciale
};

// Middlewares
app.use(cors(corsOptions)); // Permitir peticiones del frontend
app.use(cookieParser()); //Habilita lectura de cookies
app.use(express.json()); // Leer JSON en requests

// Variables de entorno
const PORT = process.env.PORT || 3001;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

//usar rutas
app.use('/autenticacion', autenticacionRoutes);
app.use('/fuente-datos', fuenteDatosRouter)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
