//importamos librerias y el controlador
const express = require("express");
const { insertarUsuarioController, seleccionarUsuarioController } = require("./usuarioControlador");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", insertarUsuarioController);
router.post("/login", seleccionarUsuarioController );


module.exports = router;