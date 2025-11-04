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

router.post("/agregar-producto", autenticacionToken, verificarRoles(1, 2), verificarImagen, insertarProductoController);
router.put("/actualizar-producto/:idProducto", autenticacionToken, verificarRoles(1, 2),  actualizarProductoController);
router.delete("/eliminar-producto/:idProducto", autenticacionToken, verificarRoles(1, 2), eliminarProductoController);

router.put("/actualizar-imagen/:idProducto", autenticacionToken, verificarRoles(1, 2),  verificarImagen, actualizarImagenProductoController);

router.patch("/modificar-cantidad", autenticacionToken, verificarRoles(1, 2), actualizarCantidadUsoInsumoProductoController);
router.delete("/eliminar-cantidad", autenticacionToken, verificarRoles(1, 2),  eliminarCantidadInsumoProductoController);
router.post("/agregar-cantidad", autenticacionToken, verificarRoles(1, 2), insertarCantidadInsumoProductoController);

router.get("/", obtenerProductosController);
router.get("/paginacion", autenticacionToken, verificarRoles(1, 2), obtenerProductosPaginacionController);
router.get("/busqueda", autenticacionToken, verificarRoles(1, 2), buscarProductosPorNombreController);
router.get("/:idProducto", autenticacionToken, verificarRoles(1, 2), obtenerProductoPorIdController);
router.get("/insumos-cantidad/:idProducto",  autenticacionToken, verificarRoles(1, 2), obtenerInsumosPorProductoControlller);

router.get("/filtrar-categoria/:idCategoria",  autenticacionToken, verificarRoles(1, 2), obtenerProductosPorCategoriaController);

router.post("/categorias/agregar", autenticacionToken, verificarRoles(1, 2), insertarCategoriaProductoController);
router.put("/categorias/actualizar/:idCategoria", autenticacionToken, verificarRoles(1, 2), actualizarCategoriaProductoController);
router.get("/categorias/all", autenticacionToken, verificarRoles(1, 2), obtenerCategoriasProductoController);
router.get("/categorias/:idCategoria", autenticacionToken, verificarRoles(1, 2), obtenerCategoriaPorIdController);

module.exports = router;
