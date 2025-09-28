// Importamos los modelos que manejan la lógica de base de datos para ventas
const {
    insertarVentaModel,
    obtenerVentasModel, 
    obtenerVentasIDModel
} = require('./ventaModelo');

//Importamos el servico de nubefact
const {
    generarComprobanteNubefact
} = require("../../servicios/nubefact.js")

//Registrar venta

const registrarVentasService = async (datosVenta) => {


    // LLamamos al servicio de nubefact
    const comprobante = await generarComprobanteNubefact(datosVenta);
    
    // Verificamos si hay errores
    if (comprobante && comprobante.errors) {
        console.log("Error en Nubefact:", comprobante.errors);
        throw Object.assign(new Error(`Error Nubefact: ${comprobante.errors} - Código: ${comprobante.codigo}`), { status: 400 });
    } else if (comprobante && comprobante.enlace_del_pdf) {
        console.log("Comprobante generado exitosamente:", comprobante.enlace_del_pdf);
        return { 
            mensaje: "Venta Registrada con éxito", 
            comprobante: comprobante 
        };
    } else {
        throw new Error("Respuesta inesperada de Nubefact");
    }
};

//Obtener ventas (paginacion de 20 en 20)
const obtenerVentasService = async (pagina = 1) => {
    const ventas = await obtenerVentasModel(pagina);

    return {
        pagina,
        limite: 20, // fijo, porque el SP trae de 20 en 20
        totalResultados: ventas.length,
        ventas,
    };
};


//Obtener una venta por ID
const obtenerVentasIDService = async (idVenta) => {
    //validamso que el id no este vacio
    if (!idVenta) {
        const error = new Error("Se requiere un ID de venta");
        error.status = 400;
        throw error;
    }

    //Buscamos la venta en BD
    const datosVenta = await obtenerVentasIDModel(idVenta);

    //si no se enuentra lanzamos un error
    if (!datosVenta) {
        const error = new Error("Venta no encontrada");
        error.status = 404;
        throw error;
    }
    //retornamos la venta encontrada
    return datosVenta;
};

//Exportamos los sevicios
module.exports = {
    registrarVentasService,
    obtenerVentasService,
    obtenerVentasIDService,
};