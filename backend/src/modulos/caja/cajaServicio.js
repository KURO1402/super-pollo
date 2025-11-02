require("dotenv").config();
const jwt = require("jsonwebtoken");
const { crearCajaModel, cerrarCajaModel, consultarCajaAbiertaModel, registrarIngresoCajaModel, registrarEgresoCajaModel, registrarArqueoCajaModel, obtenerMovimientosPorCajaModel, obtenerMovimientosCajaModel, obtenerCajasModel, obtenerArqueosCaja, obtenerArqueosPorCajaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja, validarDatosCerrarCaja, validarDatosIngresoCaja, validarDatosEgresoCaja, validarDatosArqueoCaja } = require("./cajaValidaciones");

//Servicio para crear una nueva caja
const crearCajaService = async (datos, token) => {
    validarDatosAbrirCaja(datos);

    cajas = await consultarCajaAbiertaModel();

    if (cajas.length > 0) {
        throw Object.assign(new Error("Ya hay una caja abierta. No se puede abrir otra."), { status: 400 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { montoInicial } = datos

    const idGenerado = await crearCajaModel(montoInicial, decodedToken.idUsuario);

    return {
        ok: true,
        idCaja: idGenerado,
        mensaje: "Caja creada exitosamente"
    };
}

//Servicio para cerrar una caja
const cerrarCajaService = async (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosCerrarCaja(decodedToken.idUsuario);

    const resultado = await cerrarCajaModel(decodedToken.idUsuario);
    //Validar que se haya cerrado la caja
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo cerrar la caja");
    }

    return {
        ok: true,
        mensaje: "Caja cerrada exitosamente"
    };
}

// Servicio para registrar un ingreso en caja
const registrarIngresoCajaService = async (datos, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosIngresoCaja(datos, decodedToken.idUsuario);
    const resultado = await registrarIngresoCajaModel(datos, decodedToken.idUsuario);

    return {
        ok: true,
        mensaje: resultado
    };
}

// Servicio para registrar un egreso en caja
const registrarEgresoCajaService = async (datos, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosEgresoCaja(datos, decodedToken.idUsuario);
    const resultado = await registrarEgresoCajaModel(datos, decodedToken.idUsuario);

    return {
        ok: true,
        mensaje: resultado
    };
}

// Servicio para registrar un arqueo de caja
const registrarArqueoCajaService = async (datos, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosArqueoCaja(datos, decodedToken.idUsuario);
    const cajaAbierta = await consultarCajaAbiertaModel();
    const montoTotal = datos.montoFisico + datos.montoTarjeta + datos.montoBilleteraDigital + datos.otros;
    const diferencia = montoTotal - cajaAbierta[0].montoActual;
    const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';
    const resultado = await registrarArqueoCajaModel(datos, diferencia, estadoArqueo, decodedToken.idUsuario);

    //Validar que se haya creado el arqueo
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo registrar el arqueo de caja");
    }

    return {
        ok: true,
        mensaje: "Arqueo de caja registrado exitosamente"
    };
};

// Servicio para obtener los movimientos de una caja específica
const obtenerMovimientosPorCajaService = async (cajaId) => {
    const movimientos = await obtenerMovimientosPorCajaModel(cajaId);
    if (movimientos.length === 0) {
        throw Object.assign(new Error("No se encontraron movimientos para la caja especificada"), { status: 404 });
    }
    return movimientos;
}

// Servicio para obtener los últimos movimientos de caja (10 en 10)
const obtenerMovimientosCajaService = async (limit, offset) => {
    const movimientos = await obtenerMovimientosCajaModel(limit, offset);
    if (movimientos.length === 0) {
        throw Object.assign(new Error("No se encontraron movimientos de caja"), { status: 404 });
    }
    return movimientos;
}

// Servicio para obtener las cajas cerradas
const obtenerCajasService = async (limit, offset) => {
    const cajas = await obtenerCajasModel(limit, offset);
    if (cajas.length === 0) {
        throw Object.assign(new Error("No se encontraron registros"), { status: 404 });
    }
    return cajas;
}

// Servicio para obtener los arqueos de caja
const obtenerArqueosCajaService = async (limit, offset) => {
    const arqueos = await obtenerArqueosCaja(limit, offset);
    if (arqueos.length === 0) {
        throw Object.assign(new Error("No se encontraron registros"), { status: 404 });
    }
    return arqueos;
}

// Servicio para obtener los arqueos de una caja específica
const obtenerArqueosPorCajaService = async (cajaId) => {
    const arqueos = await obtenerArqueosPorCajaModel(cajaId);
    if (arqueos.length === 0) {
        throw Object.assign(new Error("No se encontraron registros"), { status: 404 });
    }
    return arqueos;
};

module.exports = {
    crearCajaService,
    cerrarCajaService,
    registrarIngresoCajaService,
    registrarEgresoCajaService,
    registrarArqueoCajaService,
    obtenerMovimientosPorCajaService,
    obtenerMovimientosCajaService,
    obtenerCajasService,
    obtenerArqueosCajaService,
    obtenerArqueosPorCajaService
};