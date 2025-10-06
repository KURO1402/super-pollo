// Importamos express y el controlador de insumos
const express = require("express");
const router = express.Router();
const {
    crearInsumoController,
    listarInsumosController,
    obtenerInsumoController,
    actualizarInsumoController,
    eliminarInsumoController
} = require("./stockControlador");

// Ruta para crear un nuevo insumo
router.post("/crear", crearInsumoController);

// Ruta para listar todos los insumos
router.get("/", listarInsumosController);

// Ruta para obtener un insumo por su ID
router.get("/:id", obtenerInsumoController);

// Ruta para actualizar un insumo 
router.put("/:id", actualizarInsumoController);

// Ruta para eliminar un insumo
router.delete("/:id", eliminarInsumoController);

// Exportamos las rutas del módulo
module.exports = router;
