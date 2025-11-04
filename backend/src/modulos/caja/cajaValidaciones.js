const { consultarCajaAbiertaModel, obtenerArqueosPorCajaModel } = require("./cajaModelo")
const { consultarUsuarioPorIdModel } = require("../usuarios/usuarioModelo")

const validarDatosAbrirCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como el monto inicial para aperturar una caja."), { status: 400 });
    }
    const { montoInicial } = datos;

    if (!montoInicial || typeof montoInicial !== "number") {
         throw Object.assign(new Error("Se necesita un monto inicial"), { status: 400 });
    }

    if (montoInicial < 0) {
        throw Object.assign(new Error("El monto inicial debe ser un número mayor o igual a 0"), { status: 400 });
    }
}

const validarDatosCerrarCaja = async (usuarioId) => {

    if (typeof usuarioId !== 'number' || usuarioId <= 0) {
        throw Object.assign(new Error("El id de usuario tiene que ser valido y numerico"), { status: 400 });
    }

    const caja = await consultarCajaAbiertaModel();
    if (caja.length === 0) {
        throw Object.assign(new Error("No hay una caja abierta para cerrar."), { status: 400 });
    }
    const cajaData = caja[0];
    const idCaja = cajaData.idCaja;
    const arqueos = await obtenerArqueosPorCajaModel(idCaja);
    if (arqueos.length === 0) {
        throw Object.assign(new Error("No se puede cerrar la caja sin antes hacer un arqueo."), { status: 400 });
    }

    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }
}

const validarDatosIngresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como monto y descripción para registrar un ingreso a caja"), { status: 400 });
    }

    const { monto, descripcion } = datos;

    if (!monto || !descripcion) {
        throw Object.assign(new Error("Se necesita un monto y una descripción válidos"), { status: 400 });
    }

    if (typeof monto !== 'number' || monto <= 0) {
        throw Object.assign(new Error("El monto debe ser un número mayor a 0"), { status: 400 });
    }

    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }

    cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw Object.assign(new Error("No se puede registrar un ingreso si no hay una caja abierta."), { status: 400 });
    }
}

const validarDatosEgresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como monto y descripción para registrar un egreso a caja"), { status: 400 });
    }
    const { monto, descripcion } = datos;

    if (!monto || !descripcion) {
        throw Object.assign(new Error("Se necesita un monto y una descripción válidos"), { status: 400 });
    }

    if (typeof monto !== 'number' || monto <= 0) {
        throw Object.assign(new Error("El monto debe ser un número mayor a 0"), { status: 400 });
    }

    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }

    cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw Object.assign(new Error("No se puede registrar un egreso si no hay una caja abierta."), { status: 400 });
    }

    const caja = cajas[0];
    if (caja.montoActual < monto) {
        throw Object.assign(new Error("No hay suficiente saldo en la caja para realizar el egreso."), { status: 400 });
    }
}

const validarDatosArqueoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como el dinero fisico de caja"), { status: 400 });
    }
    const { montoFisico, montoTarjeta, montoBilleteraDigital, otros } = datos;

    if (montoFisico == undefined || typeof montoFisico !== 'number' || montoFisico < 0) {
        throw Object.assign(new Error("Se necesita el monto fisico de caja y que sea un número válido"), { status: 400 });
    }
    if (montoTarjeta === undefined || typeof montoTarjeta !== 'number' || montoTarjeta < 0) {
        throw Object.assign(new Error("Se necesita el monto de tarjeta y que sea un número válido"), { status: 400 });
    }

    if (montoBilleteraDigital === undefined || typeof montoBilleteraDigital !== 'number' || montoBilleteraDigital < 0) {
        throw Object.assign(new Error("Se necesita el monto de billetera digital y que sea un número válido"), { status: 400 });
    }

    if (otros === undefined || typeof otros !== 'number' || otros < 0) {
        throw Object.assign(new Error("Se necesita el monto de otros y que sea un número válido"), { status: 400 });
    }

    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }

    cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw Object.assign(new Error("No hay ninguna caja abierta para registrar el arqueo"), { status: 400 });
    }
};

module.exports = { 
    validarDatosAbrirCaja, 
    validarDatosCerrarCaja, 
    validarDatosIngresoCaja,
    validarDatosEgresoCaja,
    validarDatosArqueoCaja 
};