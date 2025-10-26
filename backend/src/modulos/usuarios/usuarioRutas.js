const express = require("express");
const router = express.Router();

const { actualizarUsuarioController } = require("./usuarioControlador");

router.put("/actualizar-usuario/:idUsuario", actualizarUsuarioController);

module.exports = router;