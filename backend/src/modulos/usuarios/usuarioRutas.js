//importamos librerias y el controlador

const express = require("express");
const UsuarioControlador = require("./usuarioControlador");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", UsuarioControlador.registrar);

// Ruta para refrescar accessToken
router.post("/refresh-token", UsuarioControlador.refreshToken);


//Exportamos el router 
module.exports = router;

console.log("usuarios.js funcionado")