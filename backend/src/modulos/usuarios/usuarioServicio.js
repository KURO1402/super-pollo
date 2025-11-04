const bcrypt = require("bcryptjs");

const { obtenerEstadoVerificacionCorreoModel, seleccionarUsuarioCorreoModel } = require("../autenticacion/autenticacionModelo")

const {
    insertarRolUsuarioModel,
    listarRolesModel,
    obtenerRolPorIdModel,
    actualizarNombreRolUsuarioModel,
    consultarUsuarioPorIdModel,
    actualizarUsuarioModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    consultarClaveUsuarioModel,
    eliminarUsuarioModel,
    listarUsuariosModel,
    listarUsuariosPaginacionModel,
    buscarUsuariosPorValorModel,
    contarUsuariosActivosModel,
    actualizarRolUsuarioModel
} = require("./usuarioModelo")

const { validarActualizarUsuario, validarActualizarCorreoUsuario } = require("./usuarioValidaciones")

const insertarRolUsuarioService = async (datos) => {
    if (!datos || typeof datos !== "object") {
        throw Object.assign(
            new Error("Se necesita el nombre del rol."),
            { status: 400 }
        );
    }
    const { nombreRol } = datos;
    if (!nombreRol || typeof nombreRol !== "string" || !nombreRol.trim()) {
        throw Object.assign(
            new Error("Se necesita el nombre del rol."),
            { status: 400 }
        );
    }
    const respuesta = await insertarRolUsuarioModel(nombreRol);

    return {
        ok: true,
        mensaje: respuesta
    };
};

const listarRolesService = async () => {
    const roles = await listarRolesModel();
    if (roles.length === 0) {
        throw Object.assign(
            new Error("No se encontraron roles."),
            { status: 404 }
        );
    }

    return {
        ok: true,
        roles: roles
    };
};

const actualizarNombreRolUsuarioService = async (idRol, datos) => {
    if (!idRol || isNaN(Number(idRol))) {
        throw Object.assign(
            new Error("Se necesita un ID de rol válido."),
            { status: 400 }
        );
    }
    if (!datos || typeof datos !== "object") {
        throw Object.assign(
            new Error("Se necesita el nuevo nombre del rol."),
            { status: 400 }
        );
    }
    const { nombreRol } = datos;
    if (!nombreRol || typeof nombreRol !== "string" || !nombreRol.trim()) {
        throw Object.assign(
            new Error("Se necesita el nuevo nombre del rol."),
            { status: 400 }
        );
    }
    const rol = await obtenerRolPorIdModel(idRol);
    if (!rol || rol.length === 0) {
        throw Object.assign(new Error("El rol especificado no existe."), { status: 404 });
    }
    const respuesta = await actualizarNombreRolUsuarioModel(idRol, nombreRol);

    if (!respuesta) {
        throw Object.assign(
            new Error("No se pudo actualizar rol."),
            { status: 500 }
        );
    }

    return {
        ok: true,
        mensaje: respuesta
    }
};

const actualizarUsuarioService = async (datos, idUsuario) => {
    const idUsuarioNumerico = Number(idUsuario)
    validarActualizarUsuario(datos, idUsuarioNumerico);

    const usuario = await consultarUsuarioPorIdModel(idUsuarioNumerico);

    if (usuario.length === 0) {
        throw Object.assign(
            new Error("El usuario especificado no existe"),
            { status: 404 }
        );
    }
    const respuesta = await actualizarUsuarioModel(datos, idUsuarioNumerico);
    return {
        ok: true,
        mensaje: respuesta
    }
};

const actualizarCorreoUsuarioService = async (datos, idUsuario) => {
    validarActualizarCorreoUsuario(datos, idUsuario)
    const { nuevoCorreo, clave } = datos
    const idUsuarioNumerico = Number(idUsuario);

    const usuario = await consultarClaveUsuarioModel(idUsuarioNumerico);
    if (!usuario || usuario.length === 0) {
        throw Object.assign(
            new Error("El usuario especificado no existe."),
            { status: 404 }
        );
    };
    const usuarioCorreo = await seleccionarUsuarioCorreoModel(nuevoCorreo);
    if (usuarioCorreo.length > 0) {
        throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado."), { status: 409 });
    }

    const contraseñaValida = await bcrypt.compare(clave, usuario[0].clave);

    if (!contraseñaValida) {

        throw Object.assign(new Error("Clave incorrecta."), { status: 401 });
    }

    const estado = await obtenerEstadoVerificacionCorreoModel(nuevoCorreo);

    if (!estado) {
        throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
    }

    if (estado.verificado === 0) {
        throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
    }

    const respuesta = await actualizarCorreoUsuarioModel(idUsuarioNumerico, nuevoCorreo);

    return {
        ok: true,
        mensaje: respuesta
    };
};

const actualizarClaveUsuarioService = async (datos, idUsuario) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw Object.assign(
            new Error("Se necesita un ID de usuario válido."),
            { status: 400 }
        );
    }
    const idUsuarioNumerico = Number(idUsuario);

    if (!datos || typeof datos !== "object") {
        throw Object.assign(
            new Error("Se necesita la clave actual y la nueva clave."),
            { status: 400 }
        );
    }

    const { clave, nuevaClave } = datos;

    if (!clave || typeof clave !== "string" || !clave.trim()) {
        throw Object.assign(
            new Error("La clave actual es obligatoria y debe ser una cadena de texto."),
            { status: 400 }
        );
    }

    if (!nuevaClave || typeof nuevaClave !== "string" || !nuevaClave.trim()) {
        throw Object.assign(
            new Error("La nueva clave es obligatoria y debe ser una cadena de texto."),
            { status: 400 }
        );
    }
    if (nuevaClave.length < 8) {
        throw Object.assign(
            new Error("La nueva clave debe tener al menos 8 caracteres."),
            { status: 400 }
        );
    }

    const usuario = await consultarClaveUsuarioModel(idUsuarioNumerico);
    if (!usuario || usuario.length === 0) {
        throw Object.assign(
            new Error("El usuario especificado no existe."),
            { status: 404 }
        );
    }

    const claveCorrecta = await bcrypt.compare(clave, usuario[0].clave);
    if (!claveCorrecta) {
        throw Object.assign(
            new Error("Clave incorrecta."),
            { status: 401 }
        );
    }

    const nuevaClaveEncriptada = await bcrypt.hash(nuevaClave, 10);

    const respuesta = await actualizarClaveUsuarioModel(idUsuarioNumerico, nuevaClaveEncriptada);

    return {
        ok: true,
        mensaje: respuesta
    };
};

const eliminarUsuarioService = async (idUsuario) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw Object.assign(
            new Error("Se necesita un ID de usuario válido."),
            { status: 400 }
        );
    }

    const idUsuarioNumerico = Number(idUsuario);

    const usuario = await consultarUsuarioPorIdModel(idUsuarioNumerico);

    if (usuario.length === 0) {
        throw Object.assign(
            new Error("El usuario especificado no existe"),
            { status: 404 }
        );
    }

    const respuesta = await eliminarUsuarioModel(idUsuarioNumerico, 0);
    return {
        ok: true,
        mensaje: respuesta
    }
};

const obtenerUsuariosService = async (idUsuario) => {
    const usuarios = await listarUsuariosModel(idUsuario);
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No existen usuarios."),
            { status: 404 }
        );
    }
    return {
        ok: true,
        usuarios: usuarios
    };
};

const obtenerUsuariosPaginacionService = async (limit, offset, idUsuario) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const usuarios = await listarUsuariosPaginacionModel(limite, desplazamiento, idUsuario);
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No existen usuarios."),
            { status: 404 }
        );
    }
    return {
        ok: true,
        usuarios: usuarios
    };
};

const consultarUsuarioPorIdService = async (id) => {

    if (!id || isNaN(Number(id))) {
        throw Object.assign(
            new Error("Se requiere un ID de usuario válido."),
            { status: 400 }
        );
    }

    const usuario = await consultarUsuarioPorIdModel(Number(id));

    if (!usuario || usuario.length === 0) {
        throw Object.assign(
            new Error("No se encontro el usuario."),
            { status: 404 }
        );
    }

    return {
        ok: true,
        usuario: usuario[0]
    };
};

const buscarUsuariosPorValorService = async (valor, idUsuario) => {
    if (!valor || typeof valor !== "string") {
        throw Object.assign(
            new Error("Se requiere un valor válido para buscar."),
            { status: 400 }
        );
    }

    const usuarios = await buscarUsuariosPorValorModel(valor, idUsuario);
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No se encontraron usuarios que coincidan."),
            { status: 404 }
        );
    }
    return {
        ok: true,
        usuarios: usuarios
    };
};

const contarUsuariosActivosService = async () => {
    const total = await contarUsuariosActivosModel();
    if (total === undefined || total === null) {
        throw Object.assign(
            new Error("No se pudo obtener el total de usuarios activos."),
            { status: 500 }
        );
    }
    return {
        ok: true,
        total: total
    };
};

const actualizarRolUsuarioService = async (datos, idUsuario, idActual) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw Object.assign(
            new Error("Se necesita un ID de rol válido."),
            { status: 400 }
        );
    }
    if (!datos || typeof datos !== "object") {
        throw Object.assign(
            new Error("Se necesita el nombre del rol."),
            { status: 400 }
        );
    }
    const { nuevoRol } = datos;

    if (!nuevoRol || typeof nuevoRol !== "number") {
        throw Object.assign(new Error("Debe proporcionar un rol válido."), { status: 400 });
    }
    
    if (Number(idUsuario) === idActual) {
        throw Object.assign(
            new Error("Usted mismo no puede modificar su rol."),
            { status: 403 }
        );
    }

    const usuario = await consultarUsuarioPorIdModel(idUsuario);
    if (!usuario || usuario.length === 0) {
        throw Object.assign(new Error("El usuario especificado no existe."), { status: 404 });
    }

    const rol = await obtenerRolPorIdModel(nuevoRol);
    if (!rol || rol.length === 0) {
        throw Object.assign(new Error("El rol especificado no existe."), { status: 404 });
    }

    if (usuario[0].idRol === nuevoRol) {
        throw Object.assign(new Error("El usuario ya tiene asignado este rol."), { status: 400 });
    }

    const respuesta = await actualizarRolUsuarioModel(idUsuario, nuevoRol);

    return {
        ok: true,
        mensaje: respuesta.mensaje || "Rol del usuario actualizado correctamente."
    };
};


module.exports = {
    insertarRolUsuarioService,
    listarRolesService,
    actualizarNombreRolUsuarioService,
    actualizarUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    obtenerUsuariosService,
    obtenerUsuariosPaginacionService,
    consultarUsuarioPorIdService,
    buscarUsuariosPorValorService,
    contarUsuariosActivosService,
    actualizarRolUsuarioService
}