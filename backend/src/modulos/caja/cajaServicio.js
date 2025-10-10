require("dotenv").config();
const jwt = require("jsonwebtoken");
const { crearCajaModel, cerrarCajaModel, consultarCajaAbiertaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja, validarDatosCerrarCaja } = require("../../utilidades/validacionesCaja.js");

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

module.exports = { crearCajaService, cerrarCajaService }