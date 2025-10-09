const { crearCajaModel, cerrarCajaModel } = require("./cajaModelo")
const { validarDatosAbrirCaja } = require("../../utilidades/validacionesCaja.js");

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

module.exports = { crearCajaService }