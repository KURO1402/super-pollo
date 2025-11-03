const express = require("express");
const router = express.Router();
const verificarImagen = require("../../../middlewares/verificarImagenMiddleware");
const { autenticacionToken, verificarRoles } = require("../../../middlewares/autenticacionMiddleware");

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
    obtenerCategoriaPorIdController,
    obtenerCategoriasProductoController
} = require("../controlador/productoControlador");

// ✅ Rutas relacionadas a productos
router.post("/agregar-producto", autenticacionToken, verificarRoles(1, 2), verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto", verificarRoles(1, 2),  actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", verificarRoles(1, 2), autenticacionToken, eliminarProductoController);

// ✅ Rutas relacionadas a imágenes
router.put("/actualizar-imagen/:idProducto", verificarRoles(1, 2), autenticacionToken, verificarImagen, actualizarImagenProductoController);

// ✅ Rutas relacionadas a insumos y cantidades
router.patch("/modificar-cantidad", verificarRoles(1, 2), autenticacionToken, actualizarCantidadUsoInsumoProductoController);
router.delete("/eliminar-cantidad", verificarRoles(1, 2), autenticacionToken, eliminarCantidadInsumoProductoController);
router.post("/agregar-cantidad", verificarRoles(1, 2), autenticacionToken, insertarCantidadInsumoProductoController);

router.get("/", autenticacionToken, verificarRoles(1, 2), obtenerProductosController);
router.get("/paginacion", autenticacionToken, verificarRoles(1, 2), obtenerProductosPaginacionController);
router.get("/busqueda", autenticacionToken, verificarRoles(1, 2), buscarProductosPorNombreController);
router.get("/:idProducto", autenticacionToken, verificarRoles(1, 2), obtenerProductoPorIdController);
router.get("/insumos-cantidad/:idProducto", verificarRoles(1, 2), autenticacionToken, obtenerInsumosPorProductoControlller);
router.get("/filtrar-categoria/:idCategoria", verificarRoles(1, 2), autenticacionToken, obtenerProductosPorCategoriaController);

//Rutas para categorias
router.post("/categorias/agregar", autenticacionToken, verificarRoles(1, 2), insertarCategoriaProductoController);
router.put("/categorias/actualizar/:idCategoria", verificarRoles(1, 2), autenticacionToken, actualizarCategoriaProductoController);
router.get("/categorias/all", autenticacionToken, verificarRoles(1, 2), obtenerCategoriasProductoController);
router.get("/categorias/:idCategoria", autenticacionToken, verificarRoles(1, 2), obtenerCategoriaPorIdController);

module.exports = router;
