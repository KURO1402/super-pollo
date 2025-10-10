require("dotenv").config();
const jwt = require("jsonwebtoken");
const { crearCajaModel, cerrarCajaModel, registrarIngresoCajaModel, registrarEgresoCajaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja, validarDatosCerrarCaja, validarDatosIngresoCaja , validarDatosEgresoCaja } = require("../../utilidades/validacionesCaja.js");

//Servicio para crear una nueva caja
const crearCajaService = async (montoInicial, token) => {

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    await validarDatosAbrirCaja(montoInicial, decodedToken.idUsuario);
    const resultado = await crearCajaModel(montoInicial, decodedToken.idUsuario);
    //Validar que se haya creado la caja
    if(resultado.affectedRows === 0) {
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
    if(resultado.affectedRows === 0) {
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
    if(resultado.affectedRows === 0) {
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
    if(resultado.affectedRows === 0) {
        throw new Error("No se pudo crear la caja");
    }

    return { 
        ok: true,
        mensaje: "Egreso registrado exitosamente" 
    };
}

module.exports = { 
    crearCajaService, 
    cerrarCajaService, 
    registrarIngresoCajaService, 
    registrarEgresoCajaService 
};