const express = require("express");
const router = express.Router();
const verificarToken = require("../../middlewares/autenticacionMiddleware")

const { 
    actualizarUsuarioController, 
    actualizarCorreoUsuarioController, 
    actualizarClaveUsuarioController,
    eliminarUsuarioController 
} = require("./usuarioControlador");

router.put("/actualizar-usuario/:idUsuario", verificarToken, actualizarUsuarioController);

router.patch("/actualizar-correo/:idUsuario", verificarToken, actualizarCorreoUsuarioController);
router.patch("/actualizar-clave/:idUsuario", verificarToken, actualizarClaveUsuarioController);
router.delete("/:idUsuario", verificarToken, eliminarUsuarioController);

module.exports = router;