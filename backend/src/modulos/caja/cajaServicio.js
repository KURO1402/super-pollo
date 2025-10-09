const { crearCajaModel, cerrarCajaModel, consultarCajaAbiertaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja, validarDatosCerrarCaja } = require("../../utilidades/validacionesCaja.js");

//Servicio para crear una nueva caja
const crearCajaService = async (datos) => {

    await validarDatosAbrirCaja(datos);
    const resultado = await crearCajaModel(datos);
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
const cerrarCajaService = async (datos) => {

    await validarDatosCerrarCaja(datos);
    const cajaAbierta = await consultarCajaAbiertaModel();
    //Agregar el montoFinal al objeto datos
    datos.montoFinal = cajaAbierta[0].montoActual;

    const resultado = await cerrarCajaModel(datos); 
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