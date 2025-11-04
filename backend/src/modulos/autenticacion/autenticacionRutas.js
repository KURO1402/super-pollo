const express = require("express");
const { 
    registrarUsuarioController, 
    seleccionarUsuarioController, 
    renovarAccessTokenController,
    insertarVerificacionCorreoController,
    validarCodigoVerificacionCorreoController 
} = require("./autenticacionControlador.js");

const router = express.Router();


router.post("/registrar", registrarUsuarioController);

router.post("/generar-codigo", insertarVerificacionCorreoController);

router.post("/validar-codigo", validarCodigoVerificacionCorreoController);

router.post("/login", seleccionarUsuarioController );


router.post("/renovar-token", renovarAccessTokenController);


module.exports = router;