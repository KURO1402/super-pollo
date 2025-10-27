const { actualizarUsuarioService, actualizarCorreoUsuarioService, actualizarClaveUsuarioService } = require("./usuarioServicio");

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

module.exports = {
    actualizarUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController
}