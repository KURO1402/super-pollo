const { validarTelefono, validarDocumento} = require("../../utilidades/validaciones");

const validarActualizarUsuario = (datos, idUsuario) => {
    if (!datos || typeof datos !== "object") {
        throw Object.assign(
            new Error("Se necesitan los datos del usuario para actualizarlo"),
            { status: 400 }
        );
    }

    const {
        nombresUsuario,
        apellidosUsuario,
        numeroDocumentoUsuario,
        telefonoUsuario,
        idTipoDocumento
    } = datos;

    if (!idUsuario || typeof idUsuario !== "number") {
        throw Object.assign(
            new Error("El ID del usuario es obligatorio y debe ser numérico"),
            { status: 400 }
        );
    }

    if (!nombresUsuario || typeof nombresUsuario !== "string" || !nombresUsuario.trim()) {
        throw Object.assign(
            new Error("El nombre del usuario es obligatorio y debe ser un texto válido"),
            { status: 400 }
        );
    }

    if (!apellidosUsuario || typeof apellidosUsuario !== "string" || !apellidosUsuario.trim()) {
        throw Object.assign(
            new Error("El apellido del usuario es obligatorio y debe ser un texto válido"),
            { status: 400 }
        );
    }

    if (!numeroDocumentoUsuario || typeof numeroDocumentoUsuario !== "string" || !numeroDocumentoUsuario.trim()) {
        throw Object.assign(
            new Error("El número de documento es obligatorio y debe ser un texto válido"),
            { status: 400 }
        );
    }

    if (!telefonoUsuario || typeof telefonoUsuario !== "string" || !telefonoUsuario.trim()) {
        throw Object.assign(
            new Error("El teléfono del usuario es obligatorio y debe ser un texto válido"),
            { status: 400 }
        );
    }

    if (!idTipoDocumento || typeof idTipoDocumento !== "number") {
        throw Object.assign(
            new Error("El tipo de documento es obligatorio y debe ser numérico"),
            { status: 400 }
        );
    }

    validarDocumento(idTipoDocumento, numeroDocumentoUsuario);
    validarTelefono(telefonoUsuario);
};

module.exports = {
    validarActualizarUsuario
}