//importamos librerias y el controlador
const express = require("express");
const UsuarioController = require("./usuarioControlador");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", UsuarioController);


module.exports = router;