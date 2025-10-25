const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware"); 

const { insertarProductoController, actualizarProductoController, eliminarProductoController } = require("../controlador/productoControlador");

router.post("/agregar-producto",verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto", actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", eliminarProductoController);

module.exports = router;