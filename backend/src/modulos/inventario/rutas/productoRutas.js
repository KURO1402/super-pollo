const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware");
const autenticacionToken = require("../../../middlewares/autenticacionMiddleware")

const {
    insertarProductoController,
    actualizarProductoController,
    eliminarProductoController,
    actualizarImagenProductoController,
    actualizarCantidadUsoInsumoProductoController,
    eliminarCantidadInsumoProductoController,
    insertarCantidadInsumoProductoController,
    obtenerProductosController,
    obtenerProductosPaginacionController,
    obtenerProductoPorIdController,
    buscarProductosPorNombreController,
    obtenerProductosPorCategoriaController,
    obtenerInsumosPorProductoControlller,
    insertarCategoriaProductoController,
    actualizarCategoriaProductoController,
    obtenerCategoriaPorIdController
} = require("../controlador/productoControlador");

// ✅ Rutas relacionadas a productos
router.post("/agregar-producto", autenticacionToken, verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto",  actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", autenticacionToken, eliminarProductoController);

// ✅ Rutas relacionadas a imágenes
router.put("/actualizar-imagen/:idProducto", autenticacionToken, verificarImagen, actualizarImagenProductoController);

// ✅ Rutas relacionadas a insumos y cantidades
router.patch("/modificar-cantidad", autenticacionToken, actualizarCantidadUsoInsumoProductoController);
router.delete("/eliminar-cantidad", autenticacionToken, eliminarCantidadInsumoProductoController);
router.post("/agregar-cantidad", autenticacionToken, insertarCantidadInsumoProductoController);

router.get("/", obtenerProductosController);
router.get("/paginacion", obtenerProductosPaginacionController)
router.get("/busqueda", buscarProductosPorNombreController);
router.get("/:idProducto", obtenerProductoPorIdController);
router.get("/insumos-cantidad/:idProducto", obtenerInsumosPorProductoControlller);
router.get("/filtrar-categoria/:idCategoria", obtenerProductosPorCategoriaController);

//Rutas para categorias
router.post("/categorias/agregar", insertarCategoriaProductoController);
router.put("/categorias/actualizar/:idCategoria", actualizarCategoriaProductoController);
router.get("/categorias/:idCategoria", obtenerCategoriaPorIdController)

module.exports = router;
