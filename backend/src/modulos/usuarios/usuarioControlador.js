const { actualizarUsuarioService } = require("./usuarioServicio");

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

module.exports = {
    actualizarUsuarioController
}