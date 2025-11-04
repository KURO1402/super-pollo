const { 
    insertarRolUsuarioService,
    listarRolesService,
    actualizarNombreRolUsuarioService,
    actualizarUsuarioService, 
    actualizarCorreoUsuarioService, 
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    obtenerUsuariosService,
    obtenerUsuariosPaginacionService,
    buscarUsuariosPorValorService,
    consultarUsuarioPorIdService,
    contarUsuariosActivosService,
    actualizarRolUsuarioService 
} = require("./usuarioServicio");

const insertarRolUsuarioController = async (req, res) => {
    try {
        const respuesta = await insertarRolUsuarioService(req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
}
const listarRolesController = async (req, res) => {
    try {
        const respuesta = await listarRolesService();
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarNombreRolUsuarioController = async (req, res) => {
    const { idRol } = req.params;

    try {
        const respuesta = await actualizarNombreRolUsuarioService(idRol, req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
}

const actualizarUsuarioController = async (req, res) => {
    try {
        const respuesta = await actualizarUsuarioService(req.body, req.params.idUsuario);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarCorreoUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; 
        const respuesta = await actualizarCorreoUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {

        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarClaveUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; 
        const respuesta = await actualizarClaveUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; 
        const respuesta = await eliminarUsuarioService(idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerUsuariosController = async (req, res) => {
    const {idUsuario} = req.usuario;
    try {
        const usuarios = await obtenerUsuariosService(idUsuario);

        return res.status(200).json(usuarios);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerUsuariosPaginacionController = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const {idUsuario} = req.usuario;

        const usuarios = await obtenerUsuariosPaginacionService(limit, offset, idUsuario);

        return res.status(200).json(usuarios);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const buscarUsuariosPorValorController = async (req, res) => {
    try {
        const { valor } = req.query;
        const {idUsuario} = req.usuario;
        const usuarios = await buscarUsuariosPorValorService(valor, idUsuario);

        return res.status(200).json(usuarios);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const consultarUsuarioPorIdController = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const usuario = await consultarUsuarioPorIdService(idUsuario);

        return res.status(200).json(usuario);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const contarUsuariosActivosController = async (req, res) => {
    try {
        const respuesta = await contarUsuariosActivosService();

        return res.status(200).json(respuesta);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarRolUsuarioController = async (req, res) => {
    try {
        const { idUser } = req.params;
        const {idUsuario} = req.usuario;
        const respuesta = await actualizarRolUsuarioService(req.body, idUser, idUsuario);

        return res.status(200).json(respuesta);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

module.exports = {
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
}