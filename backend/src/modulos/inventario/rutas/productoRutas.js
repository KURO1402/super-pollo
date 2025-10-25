const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware"); 

const { insertarProductoController } = require("../controlador/productoControlador");

router.post("/agregar-producto",verificarImagen, insertarProductoController);

module.exports = router;