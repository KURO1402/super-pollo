// Importamos express y el controlador de insumos
const express = require("express");
const router = express.Router();
const {
    insertarInsumoController,
    listarInsumosController,
    obtenerInsumoController,
    actualizarInsumoController,
    eliminarInsumoController
} = require("../controlador/inventarioControlador");

// Ruta para crear un nuevo insumo
router.post("/insertar-insumo", insertarInsumoController);

// Ruta para listar todos los insumos
router.get("/", listarInsumosController);

// Ruta para obtener un insumo por su ID
router.get("/:id", obtenerInsumoController);

// Ruta para actualizar un insumo 
router.put("/actualizar/:idInsumo", actualizarInsumoController);

// Ruta para eliminar un insumo
router.delete("/:id", eliminarInsumoController);

// Exportamos las rutas del módulo
module.exports = router;
