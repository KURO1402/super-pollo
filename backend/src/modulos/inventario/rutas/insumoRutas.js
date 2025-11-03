// Importamos express y el controlador de insumos
const express = require("express");
const router = express.Router();
const {
    insertarInsumoController,
    obtenerInsumosController,
    obtenerInsumosPaginacionController,
    obtenerInsumoIDController,
    actualizarInsumoController,
    eliminarInsumoController
} = require("../controlador/insumoControlador");
const { autenticacionToken, verificarRoles } = require("../../../middlewares/autenticacionMiddleware")

// Ruta para crear un nuevo insumo
router.post("/insertar", autenticacionToken, verificarRoles(1, 2), insertarInsumoController);
// Ruta para listar todos los insumos
router.get("/", autenticacionToken, verificarRoles(1, 2), obtenerInsumosController);
router.get("/paginacion", autenticacionToken, verificarRoles(1, 2), obtenerInsumosPaginacionController);
// Ruta para actualizar un insumo 
router.put("/actualizar/:idInsumo", autenticacionToken, verificarRoles(1, 2), actualizarInsumoController);
// Ruta para eliminar un insumo
router.delete("/eliminar/:idInsumo", autenticacionToken, verificarRoles(1, 2), eliminarInsumoController);
// Ruta para obtener un insumo por su ID
router.get("/:idInsumo", autenticacionToken, verificarRoles(1, 2), obtenerInsumoIDController);

// Exportamos las rutas del módulo
module.exports = router;
