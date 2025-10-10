const { consultarCajaAbiertaModel } = require("../modulos/caja/cajaModelo")
const { consultarUsuarioPorIdModel } = require("../modulos/usuarios/usuarioModelo")

const validarDatosAbrirCaja = async (montoInicial, usuarioId) => {

    //Validar que montoInicial y usuarioId estén presentes y sean del tipo correcto
    if (!montoInicial || !usuarioId) {
         throw Object.assign(new Error("Se necesita un monto inicial y un ID de usuario válidos"), { status: 400 });
    }

    // validar que montoInicial y usuarioId estén presentes y sean del tipo correcto
    if (!montoInicial || !usuarioId) {
         throw Object.assign(new Error("Se necesita un monto inicial y un ID de usuario válidos"), { status: 400 });
    }
    //Validar que montoInicial sea un numero y mayor o igual a 0
    if (typeof montoInicial !== 'number' || montoInicial < 0) {
        throw Object.assign(new Error("El monto inicial debe ser un número mayor o igual a 0"), { status: 400 });
    }

    //Validar que usuarioId sea un numero y mayor a 0
    if (typeof usuarioId !== 'number' || usuarioId <= 0) {
        throw Object.assign(new Error("El id de usuario tiene que ser valido y numerico"), { status: 400 });
    }
    
    //Validar que no haya una caja ya abierta
    cajas = await consultarCajaAbiertaModel();
    if (cajas.length > 0) {
        throw Object.assign(new Error("Ya hay una caja abierta. No se puede abrir otra."), { status: 400 });
    }

    // Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }
}

// Validaciones para cerrar caja
const validarDatosCerrarCaja = async (usuarioId) => {
    //Validar que usuarioId sea un numero y mayor a 0
    if (typeof usuarioId !== 'number' || usuarioId <= 0) {
        throw Object.assign(new Error("El id de usuario tiene que ser valido y numerico"), { status: 400 });
    }

    // Validar que la caja esté abierta
    const caja = await consultarCajaAbiertaModel();
    if (caja.length === 0) {
        throw Object.assign(new Error("No hay una caja abierta para cerrar."), { status: 400 });
    }

    // Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }
}

module.exports = { validarDatosAbrirCaja, validarDatosCerrarCaja }