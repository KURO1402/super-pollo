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

// Ruta para crear un nuevo insumo
router.post("/insertar", insertarInsumoController);
// Ruta para listar todos los insumos
router.get("/obtener", obtenerInsumosController);
router.get("/paginacion", obtenerInsumosPaginacionController);
// Ruta para actualizar un insumo 
router.put("/actualizar/:idInsumo", actualizarInsumoController);
// Ruta para eliminar un insumo
router.delete("/eliminar/:idInsumo", eliminarInsumoController);
// Ruta para obtener un insumo por su ID
router.get("/:idInsumo", obtenerInsumoIDController);

// Exportamos las rutas del módulo
module.exports = router;
