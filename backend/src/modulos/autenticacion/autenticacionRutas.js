//importamos librerias y el controlador
const express = require("express");
const { 
    insertarUsuarioController, 
    seleccionarUsuarioController, 
    renovarAccessTokenController,
    insertarVerificacionCorreoController,
    validarCodigoVerificacionCorreoController 
} = require("./autenticacionControlador.js");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", insertarUsuarioController);
//ruta para iniciar sesion
router.post("/login", seleccionarUsuarioController );

//ruta para renovar accesToken
router.post("/token", renovarAccessTokenController);

//Ruta para verificar un correo sea existente
router.post("/generar-codigo", insertarVerificacionCorreoController);

//Ruta para validar el codgo de verificaion de correo
router.post("/validar-codigo", validarCodigoVerificacionCorreoController);


module.exports = router;