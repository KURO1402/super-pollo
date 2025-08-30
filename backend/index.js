const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones del frontend
app.use(express.json()); // Leer JSON en requests

// Variables de entorno
const PORT = process.env.PORT || 3001;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
