const express = require("express");
const router = express.Router();
const verificarToken = require("../../middlewares/autenticacionMiddleware");

const { 
    actualizarUsuarioController, 
    actualizarCorreoUsuarioController, 
    actualizarClaveUsuarioController,
    eliminarUsuarioController,
    obtenerUsuariosController,
    obtenerUsuariosPaginacionController,
    consultarUsuarioPorIdController,
    buscarUsuariosPorValorController,
    contarUsuariosActivosController 
} = require("./usuarioControlador");

// Rutas de actualización y eliminación
router.put("/actualizar-usuario/:idUsuario", verificarToken, actualizarUsuarioController);
router.patch("/actualizar-correo/:idUsuario", verificarToken, actualizarCorreoUsuarioController);
router.patch("/actualizar-clave/:idUsuario", verificarToken, actualizarClaveUsuarioController);
router.delete("/:idUsuario", verificarToken, eliminarUsuarioController);

// Rutas de consulta
router.get("/", obtenerUsuariosController); // Obtener todos los usuarios
router.get("/paginacion", obtenerUsuariosPaginacionController); // Usuarios con paginación
router.get("/buscar", buscarUsuariosPorValorController); // Buscar por valor ya sea nombre, apellido, correo o telefono
router.get("/total-usuarios", contarUsuariosActivosController); // Contar usuarios activos
router.get("/:idUsuario", consultarUsuarioPorIdController); // Consultar usuario por ID

module.exports = router;
