//importamos librerias y el controlador
const express = require("express");
const { 
    registrarUsuarioController, 
    seleccionarUsuarioController, 
    renovarAccessTokenController,
    insertarVerificacionCorreoController,
    validarCodigoVerificacionCorreoController 
} = require("./autenticacionControlador.js");

//creamos en router
const router = express.Router();

//ruta para registrar usuarios
router.post("/registrar", registrarUsuarioController);
//Ruta para verificar un correo sea existente
router.post("/generar-codigo", insertarVerificacionCorreoController);
//Ruta para validar el codgo de verificaion de correo
router.post("/validar-codigo", validarCodigoVerificacionCorreoController);
//ruta para iniciar sesion
router.post("/login", seleccionarUsuarioController );

//ruta para renovar accesToken
router.post("/renovar-token", renovarAccessTokenController);


module.exports = router;