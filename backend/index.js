require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

//ruta registrar usuario
const usuariosRoutes = require("./src/modulos/usuarios/usuarioRutas.js");

//ruta para ventas
const ventasRoutes = require("./src/modulos/ventas/ventaRutas.js");


const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones del frontend
app.use(cookieParser()); 
app.use(express.json()); // Leer JSON en requests

// Variables de entorno
const PORT = process.env.PORT || 3001;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

//usar rutas
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
