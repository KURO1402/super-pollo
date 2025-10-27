const express = require("express");
const router = express.Router();
const verificarToken = require("../../middlewares/autenticacionMiddleware")

const { actualizarUsuarioController, actualizarCorreoUsuarioController, actualizarClaveUsuarioController } = require("./usuarioControlador");

router.put("/actualizar-usuario/:idUsuario", verificarToken, actualizarUsuarioController);

router.patch("/actualizar-correo/:idUsuario", actualizarCorreoUsuarioController);
router.patch("/actualizar-clave/:idUsuario", actualizarClaveUsuarioController);

module.exports = router;