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
router.put("/actualizar-producto/:idProducto", autenticacionToken, verificarRoles(1, 2),  actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", autenticacionToken, verificarRoles(1, 2), eliminarProductoController);

// ✅ Rutas relacionadas a imágenes
router.put("/actualizar-imagen/:idProducto", autenticacionToken, verificarRoles(1, 2),  verificarImagen, actualizarImagenProductoController);

// ✅ Rutas relacionadas a insumos y cantidades
router.patch("/modificar-cantidad", autenticacionToken, verificarRoles(1, 2), actualizarCantidadUsoInsumoProductoController);
router.delete("/eliminar-cantidad", autenticacionToken, verificarRoles(1, 2),  eliminarCantidadInsumoProductoController);
router.post("/agregar-cantidad", autenticacionToken, verificarRoles(1, 2), insertarCantidadInsumoProductoController);

router.get("/", obtenerProductosController);
router.get("/paginacion", obtenerProductosPaginacionController);
router.get("/busqueda", buscarProductosPorNombreController);
router.get("/:idProducto", obtenerProductoPorIdController);
router.get("/insumos-cantidad/:idProducto", autenticacionToken, verificarRoles(1, 2), obtenerInsumosPorProductoControlller);
router.get("/filtrar-categoria/:idCategoria", obtenerProductosPorCategoriaController);
router.get("/insumos-cantidad/:idProducto",  autenticacionToken, verificarRoles(1, 2), obtenerInsumosPorProductoControlller);
//Rutas para categorias
router.post("/categorias/agregar", autenticacionToken, verificarRoles(1, 2), insertarCategoriaProductoController);
router.put("/categorias/actualizar/:idCategoria", autenticacionToken, verificarRoles(1, 2), actualizarCategoriaProductoController);
router.get("/categorias/all", autenticacionToken, verificarRoles(1, 2), obtenerCategoriasProductoController);
router.get("/categorias/:idCategoria", autenticacionToken, verificarRoles(1, 2), obtenerCategoriaPorIdController);

module.exports = router;
