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


router.post("/insertar", autenticacionToken, verificarRoles(1, 2), insertarInsumoController);

router.get("/", autenticacionToken, verificarRoles(1, 2), obtenerInsumosController);
router.get("/paginacion", autenticacionToken, verificarRoles(1, 2), obtenerInsumosPaginacionController);

router.put("/actualizar/:idInsumo", autenticacionToken, verificarRoles(1, 2), actualizarInsumoController);

router.delete("/eliminar/:idInsumo", autenticacionToken, verificarRoles(1, 2), eliminarInsumoController);

router.get("/:idInsumo", autenticacionToken, verificarRoles(1, 2), obtenerInsumoIDController);


module.exports = router;
