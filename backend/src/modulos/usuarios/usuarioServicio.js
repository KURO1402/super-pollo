const bcrypt = require("bcryptjs");

const { obtenerEstadoVerificacionCorreoModel, seleccionarUsuarioCorreoModel } = require("../autenticacion/autenticacionModelo")

const {
    consultarUsuarioPorIdModel,
    actualizarUsuarioModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    consultarClaveUsuarioModel,
    eliminarUsuarioModel,
    listarUsuariosModel,
    listarUsuariosPaginacionModel,
    buscarUsuariosPorValorModel,
    contarUsuariosActivosModel
} = require("./usuarioModelo")

const { validarActualizarUsuario, validarActualizarCorreoUsuario } = require("./usuarioValidaciones")


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

//Actualizar correo 
const actualizarCorreoUsuarioService = async (datos, idUsuario) => {
    validarActualizarCorreoUsuario(datos, idUsuario)
    const { nuevoCorreo, clave } = datos
    const idUsuarioNumerico = Number(idUsuario);
    // 🔹 Verificar existencia del usuario
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
    //console.log(usuario.clave)
    // Verificar contraseña con bcrypt (retorna true si las claves coinciden)
    const contraseñaValida = await bcrypt.compare(clave, usuario[0].clave);
    //Si es false es decir que las contraseñas no coinciden
    if (!contraseñaValida) {
        //Lanzamos error
        throw Object.assign(new Error("Clave incorrecta."), { status: 401 });
    }
    // Verificación de correo
    const estado = await obtenerEstadoVerificacionCorreoModel(nuevoCorreo);

    if (!estado) {
        throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
    }

    if (estado.verificado === 0) {
        throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
    }

    // 🔹 Actualizar correo
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

    // 🔹 Validar campos
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

    // 🔹 Verificar existencia del usuario
    const usuario = await consultarClaveUsuarioModel(idUsuarioNumerico);
    if (!usuario || usuario.length === 0) {
        throw Object.assign(
            new Error("El usuario especificado no existe."),
            { status: 404 }
        );
    }

    // 🔹 Verificar clave actual
    const claveCorrecta = await bcrypt.compare(clave, usuario[0].clave);
    if (!claveCorrecta) {
        throw Object.assign(
            new Error("Clave incorrecta."),
            { status: 401 }
        );
    }

    // 🔹 Encriptar nueva clave antes de actualizar
    const nuevaClaveEncriptada = await bcrypt.hash(nuevaClave, 10);

    // 🔹 Actualizar clave
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
    console.log(respuesta);
    return {
        ok: true,
        mensaje: respuesta
    }
};

// Servicio para obtener todos los usuarios
const obtenerUsuariosService = async () => {
    const usuarios = await listarUsuariosModel();
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No existen usuarios."),
            { status: 404 }
        );
    }
    return {
        ok: true, 
        usuarios:usuarios
    };
};

// Servicio para obtener usuarios con paginación
const obtenerUsuariosPaginacionService = async (limit, offset) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const usuarios = await listarUsuariosPaginacionModel(limite, desplazamiento);
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No existen usuarios."),
            { status: 404 }
        );
    }
    return {
        ok: true, 
        usuarios:usuarios
    };
};

// Servicio para consultar un usuario por su ID
const consultarUsuarioPorIdService = async (id) => {
    // Validar que se envíe un ID numérico válido
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


// Servicio para buscar usuarios por un valor (nombre, apellido, correo o teléfono)
const buscarUsuariosPorValorService = async (valor) => {
    if (!valor || typeof valor !== "string") {
        throw Object.assign(
            new Error("Se requiere un valor válido para buscar."),
            { status: 400 }
        );
    }

    const usuarios = await buscarUsuariosPorValorModel(valor);
    if (!usuarios || usuarios.length === 0) {
        throw Object.assign(
            new Error("No se encontraron usuarios que coincidan."),
            { status: 404 }
        );
    }
    return {
        ok: true, 
        usuarios:usuarios
    };
};

// Servicio para contar usuarios activos
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
        total:total
    };
};

module.exports = {
    actualizarUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    obtenerUsuariosService,
    obtenerUsuariosPaginacionService,
    consultarUsuarioPorIdService,
    buscarUsuariosPorValorService,
    contarUsuariosActivosService
}