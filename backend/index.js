require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

//rutas del modulo de autenticacion
const autenticacionRoutes = require("./src/modulos/autenticacion/autenticacionRutas");

//rutas del modulo de fuente de datos
const fuenteDatosRouter = require("./src/modulos/fuente-datos/fuenteDatosRutas")

//ruta para ventas
const ventasRoutes = require("./src/modulos/ventas/rutas/ventasRutas");
const comprobanteRoutes = require("./src/modulos/ventas/rutas/comprobanteRutas");

//ruta para reservaciones
const reservacionesRoutes = require("./src/modulos/reservaciones/reservacionesRutas.js");

//rutas para inventario
const inventarioRoutes = require("./src/modulos/inventario/rutas/inventarioRutas.js");
const movimientoRoutes = require("./src/modulos/inventario/rutas/movimientoRutas.js");

// Rutas para caja
const cajaRoutes = require("./src/modulos/caja/cajaRutas.js");

//Rutas para imagenes
const productoRoutes = require("./src/modulos/productos/productosRutas")

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
app.use('/ventas', ventasRoutes);
app.use('/ventas', comprobanteRoutes);
app.use('/autenticacion', autenticacionRoutes);
app.use('/fuente-datos', fuenteDatosRouter);
app.use('/inventario', inventarioRoutes);
app.use('/inventario-movimientos', movimientoRoutes)
app.use('/reservaciones', reservacionesRoutes);
app.use('/caja', cajaRoutes);
app.use('/productos', productoRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});