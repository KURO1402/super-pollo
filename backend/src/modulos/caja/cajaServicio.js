require("dotenv").config();
const jwt = require("jsonwebtoken");
const { crearCajaModel, cerrarCajaModel, consultarCajaAbiertaModel, registrarIngresoCajaModel, registrarEgresoCajaModel, registrarArqueoCajaModel, obtenerMovimientosPorCajaModel, obtenerUltimosMovimientosCajaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja, validarDatosCerrarCaja, validarDatosIngresoCaja, validarDatosEgresoCaja, validarDatosArqueoCaja } = require("../../utilidades/validacionesCaja.js");

//Servicio para crear una nueva caja
const crearCajaService = async (montoInicial, token) => {

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosAbrirCaja(montoInicial, decodedToken.idUsuario);
    const resultado = await crearCajaModel(montoInicial, decodedToken.idUsuario);
    //Validar que se haya creado la caja
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo crear la caja");
    }

    return {
        ok: true,
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

    //Validar que se haya creado la caja
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo crear la caja");
    }

    return {
        ok: true,
        mensaje: "Ingreso registrado exitosamente"
    };
}

// Servicio para registrar un egreso en caja
const registrarEgresoCajaService = async (datos, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosEgresoCaja(datos, decodedToken.idUsuario);
    const resultado = await registrarEgresoCajaModel(datos, decodedToken.idUsuario);

    //Validar que se haya creado la caja
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo crear la caja");
    }

    return {
        ok: true,
        mensaje: "Egreso registrado exitosamente"
    };
}

// Servicio para registrar un arqueo de caja
const registrarArqueoCajaService = async (datos, token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosArqueoCaja(datos, decodedToken.idUsuario);
    const cajaAbierta = await consultarCajaAbiertaModel();
    const diferencia = datos.montoFisico - cajaAbierta[0].montoActual;
    const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';
    const resultado = await registrarArqueoCajaModel(datos.montoFisico, diferencia, estadoArqueo, decodedToken.idUsuario);

    //Validar que se haya creado el arqueo
    if (resultado.affectedRows === 0) {
        throw new Error("No se pudo registrar el arqueo de caja");
    }

    return {
        ok: true,
        mensaje: "Arqueo de caja registrado exitosamente"
    };
}

// Servicio para obtener los movimientos de una caja específica
const obtenerMovimientosPorCajaService = async (cajaId) => {
    const movimientos = await obtenerMovimientosPorCajaModel(cajaId);
    if (movimientos.length === 0) {
        throw Object.assign(new Error("No se encontraron movimientos para la caja especificada"), { status: 404 });
    }
    return movimientos;
}

// Servicio para obtener los últimos movimientos de caja (10 en 10)
const obtenerUltimosMovimientosCajaService = async (limit, offset) => {
    const movimientos = await obtenerUltimosMovimientosCajaModel(limit, offset);
    if (movimientos.length === 0) {
        throw Object.assign(new Error("No se encontraron movimientos de caja"), { status: 404 });
    }
    return movimientos;
}


module.exports = {
    crearCajaService,
    cerrarCajaService,
    registrarIngresoCajaService,
    registrarEgresoCajaService,
    registrarArqueoCajaService,
    obtenerMovimientosPorCajaService,
    obtenerUltimosMovimientosCajaService
};