const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware"); 

const { insertarProductoController, actualizarProductoController, eliminarProductoController, actualizarImagenProductoController, actualizarCantidadUsoInsumoProductoController } = require("../controlador/productoControlador");

router.post("/agregar-producto",verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto", actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", eliminarProductoController);
router.put("/actualizar-imagen/:idProducto", verificarImagen, actualizarImagenProductoController);
router.patch("/modificar-cantidad", actualizarCantidadUsoInsumoProductoController);

module.exports = router;