//importamos librerias y el controlador
const express = require("express");
const { 
    insertarUsuarioController, 
    seleccionarUsuarioController, 
    renovarAccessTokenController 
} = require("./autenticacionControlador.js");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", insertarUsuarioController);
//ruta para iniciar sesion
router.post("/login", seleccionarUsuarioController );

//ruta para renovar accesToken
router.post("/token", renovarAccessTokenController);


module.exports = router;