// Importamos los modelos que manejan la lógica de base de datos para ventas
const {
    insertarVentaModel,
    obtenerVentasModel, 
    obtenerVentasIDModel
} = require('./ventaModelo');

//Registrar venta

const registrarVentasService = async (datosVenta) => {
    //validamos los campos obligatorios
    if (!datosVenta.numeroDocumentoCliente || !datosVenta.totalVenta) {
        const error = new Error("Faltan datos obligatorios de la venta");
        error.status = 400; //codigo de error http si los requeridos no estan presentes
        throw error; //lanzamos el error para que lo capture el controlador
    }

    //Insertamos la venta en la BD usando el modelo
    const nuevaVenta = await insertarVentaModel(datosVenta);
    //retornamos el resultado con mensaje
    return {
        mensaje: "Venta Registrada con éxito",
        ventaId: nuevaVenta.insertId || nuevaVenta.id,
    };
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