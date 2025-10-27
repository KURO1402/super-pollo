const { 
    actualizarUsuarioService, 
    actualizarCorreoUsuarioService, 
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    obtenerUsuariosService,
    obtenerUsuariosPaginacionService,
    buscarUsuariosPorValorService,
    consultarUsuarioPorIdService,
    contarUsuariosActivosService 
} = require("./usuarioServicio");

const actualizarUsuarioController = async (req, res) => {
    try {
        const respuesta = await actualizarUsuarioService(req.body, req.params.idUsuario);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarUsuarioController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarCorreoUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; // ID desde la URL
        const respuesta = await actualizarCorreoUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarCorreoUsuarioController:", err.message);

        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarClaveUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; // id del usuario en la URL
        const respuesta = await actualizarClaveUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarClaveUsuarioController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; // id del usuario en la URL
        const respuesta = await eliminarUsuarioService(idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en eliminarUsuarioController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Controlador para obtener todos los usuarios
const obtenerUsuariosController = async (req, res) => {
    try {
        const usuarios = await obtenerUsuariosService();

        return res.status(200).json(usuarios);
    } catch (err) {
        console.error("Error en obtenerUsuariosController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Controlador para obtener usuarios con paginación
const obtenerUsuariosPaginacionController = async (req, res) => {
    try {
        const { limit, offset } = req.query;

        const usuarios = await obtenerUsuariosPaginacionService(limit, offset);

        return res.status(200).json(usuarios);

    } catch (err) {
        console.error("Error en obtenerUsuariosPaginacionController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Controlador para buscar usuarios por un valor
const buscarUsuariosPorValorController = async (req, res) => {
    try {
        const { valor } = req.query;

        const usuarios = await buscarUsuariosPorValorService(valor);

        return res.status(200).json(usuarios);

    } catch (err) {
        console.error("Error en buscarUsuariosPorValorController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Controlador para consultar un usuario por su ID
const consultarUsuarioPorIdController = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const usuario = await consultarUsuarioPorIdService(idUsuario);

        return res.status(200).json(usuario);
    } catch (err) {
        console.error("Error en consultarUsuarioPorIdController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Controlador para contar usuarios activos
const contarUsuariosActivosController = async (req, res) => {
    try {
        const respuesta = await contarUsuariosActivosService();

        return res.status(200).json(respuesta);

    } catch (err) {
        console.error("Error en contarUsuariosActivosController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

module.exports = {
    actualizarUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController,
    eliminarUsuarioController,
    obtenerUsuariosController,
    obtenerUsuariosPaginacionController,
    consultarUsuarioPorIdController,
    buscarUsuariosPorValorController,
    contarUsuariosActivosController
}