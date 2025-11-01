const { consultarCajaAbiertaModel, obtenerArqueosPorCajaModel } = require("./cajaModelo")
const { consultarUsuarioPorIdModel } = require("../usuarios/usuarioModelo")

const validarDatosAbrirCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como el monto inicial para aperturar una caja."), { status: 400 });
    }
    const { montoInicial } = datos;

    // validar que montoInicial y usuarioId estén presentes y sean del tipo correcto
    if (!montoInicial || typeof montoInicial !== "number") {
         throw Object.assign(new Error("Se necesita un monto inicial"), { status: 400 });
    }
    //Validar que montoInicial sea un numero y mayor o igual a 0
    if (montoInicial < 0) {
        throw Object.assign(new Error("El monto inicial debe ser un número mayor o igual a 0"), { status: 400 });
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

    //Validar que la caja ya este arqueada
    const arqueos = await obtenerArqueosPorCajaModel(caja.idCaja);
    if (arqueos.length === 0) {
        throw Object.assign(new Error("No se puede cerrar la caja sin antes hacer un arqueo."), { status: 400 });
    }

    // Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }
}

//Validaciones para registrar ingreso en caja
const validarDatosIngresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como monto y descripción para registrar un ingreso a caja"), { status: 400 });
    }

    const { monto, descripcion } = datos;

    //Validar que monto y descripcion estén presentes
    if (!monto || !descripcion) {
        throw Object.assign(new Error("Se necesita un monto y una descripción válidos"), { status: 400 });
    }

    //Validar que monto sea un número y mayor a 0
    if (typeof monto !== 'number' || monto <= 0) {
        throw Object.assign(new Error("El monto debe ser un número mayor a 0"), { status: 400 });
    }

    //Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }
    //Validar que exista una caja abierta
    cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw Object.assign(new Error("No se puede registrar un ingreso si no hay una caja abierta."), { status: 400 });
    }
}

//Validaciones para registrar egreso en caja
const validarDatosEgresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos como monto y descripción para registrar un egreso a caja"), { status: 400 });
    }
    const { monto, descripcion } = datos;

    //Validar que monto y descripcion estén presentes
    if (!monto || !descripcion) {
        throw Object.assign(new Error("Se necesita un monto y una descripción válidos"), { status: 400 });
    }

    //Validar que monto sea un número y mayor a 0
    if (typeof monto !== 'number' || monto <= 0) {
        throw Object.assign(new Error("El monto debe ser un número mayor a 0"), { status: 400 });
    }

    //Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }

    //Validar que exista una caja abierta
    cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw Object.assign(new Error("No se puede registrar un egreso si no hay una caja abierta."), { status: 400 });
    }
    //Validar que la caja tenga saldo suficiente para el egreso
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

    //Validar que el usuarioId exista en la base de datos
    const usuario = await consultarUsuarioPorIdModel(usuarioId);
    if (usuario.length === 0) {
        throw Object.assign(new Error("Usuario inexistente"), { status: 400 });
    }

    //Validar que exista una caja abierta
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