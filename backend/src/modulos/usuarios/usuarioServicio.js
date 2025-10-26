const {
    consultarUsuarioPorIdModel,
    actualizarUsuarioModel
} = require("./usuarioModelo")

const { validarActualizarUsuario } = require("./usuarioValidaciones")


const actualizarUsuarioService = async (datos, idUsuario) => {
    const idUsuarioNumerico = Number(idUsuario)
    validarActualizarUsuario(datos, idUsuarioNumerico);

    const usuario = await consultarUsuarioPorIdModel(idUsuarioNumerico);

    if(usuario.length === 0){
        throw Object.assign(
            new Error("El usuario especificado no existe"),
            { status: 404 }
        );
    }
    const respuesta = await actualizarUsuarioModel(datos, idUsuarioNumerico);
    return{
        ok: true,
        mensaje: respuesta
    }
};

module.exports = {
    actualizarUsuarioService
}