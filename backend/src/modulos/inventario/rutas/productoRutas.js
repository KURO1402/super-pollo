const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware");

const {
    insertarProductoController,
    actualizarProductoController,
    eliminarProductoController,
    actualizarImagenProductoController,
    actualizarCantidadUsoInsumoProductoController,
    eliminarCantidadInsumoProductoController,
    insertarCantidadInsumoProductoController
} = require("../controlador/productoControlador");

// ✅ Rutas relacionadas a productos
router.post("/agregar-producto", verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto", actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", eliminarProductoController);

// ✅ Rutas relacionadas a imágenes
router.put("/actualizar-imagen/:idProducto", verificarImagen, actualizarImagenProductoController);

// ✅ Rutas relacionadas a insumos y cantidades
router.patch("/modificar-cantidad", actualizarCantidadUsoInsumoProductoController);
router.delete("/eliminar-cantidad", eliminarCantidadInsumoProductoController);
router.post("/agregar-cantidad", insertarCantidadInsumoProductoController);

module.exports = router;
