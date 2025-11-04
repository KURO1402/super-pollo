const express = require("express");
const router = express.Router();

const { 
    insertarRolUsuarioController,
    listarRolesController,
    actualizarNombreRolUsuarioController,
    actualizarUsuarioController, 
    actualizarCorreoUsuarioController, 
    actualizarClaveUsuarioController,
    eliminarUsuarioController,
    obtenerUsuariosController,
    obtenerUsuariosPaginacionController,
    consultarUsuarioPorIdController,
    buscarUsuariosPorValorController,
    contarUsuariosActivosController,
    actualizarRolUsuarioController 
} = require("./usuarioControlador");

const { autenticacionToken, verificarRoles } = require("../../middlewares/autenticacionMiddleware")

router.post("/insertar-rol", autenticacionToken, verificarRoles(1), insertarRolUsuarioController);
router.get("/roles", autenticacionToken, verificarRoles(1), listarRolesController);
router.put("/actualizar-nombre-rol/:idRol", autenticacionToken, verificarRoles(1), actualizarNombreRolUsuarioController);

router.put("/actualizar-usuario/:idUsuario", autenticacionToken, actualizarUsuarioController);
router.patch("/actualizar-correo/:idUsuario", autenticacionToken, actualizarCorreoUsuarioController);
router.patch("/actualizar-clave/:idUsuario", autenticacionToken, actualizarClaveUsuarioController);
router.delete("/:idUsuario", autenticacionToken, verificarRoles(1), eliminarUsuarioController);
router.patch("/cambiar-rol/:idUser", autenticacionToken, verificarRoles(1), actualizarRolUsuarioController);

router.get("/",autenticacionToken,verificarRoles(1), obtenerUsuariosController); // Obtener todos los usuarios
router.get("/paginacion",autenticacionToken,verificarRoles(1), obtenerUsuariosPaginacionController); // Usuarios con paginación
router.get("/buscar", autenticacionToken,verificarRoles(1), buscarUsuariosPorValorController); // Buscar por valor ya sea nombre, apellido, correo o telefono
router.get("/total-usuarios", autenticacionToken,verificarRoles(1), contarUsuariosActivosController); // Contar usuarios activos
router.get("/:idUsuario", autenticacionToken, consultarUsuarioPorIdController); // Consultar usuario por ID


module.exports = router;
