// Importamos los modelos que manejan la lógica de base de datos para ventas
const {
    obtenerSerieComprobanteModel,
    obtenerUltimoCorrelativoModel,
    insertarVentaModel,
    obtenerVentasModel,
    obtenerVentasIDModel
} = require('./ventaModelo');

//Importamos el servico de nubefact
const { generarComprobanteNubefact } = require("../../servicios/nubefact.js");
const { consultarDNI } = require("../../servicios/consultarDNI.js");

const { formatearVenta } = require("../../helpers/formatearDataVenta.js");
const generarFechaActual = require("../../helpers/generarFechaActual.js");

// Registrar venta
const registrarVentasService = async (datosVenta) => {
    const datosDB = {};

    // 1. Obtener la serie
    const serieDB = await obtenerSerieComprobanteModel(datosVenta.tipoComprobante);
    datosDB.serie = serieDB[0].serie;

    // 2. Obtener el último correlativo
    const correlativoDB = await obtenerUltimoCorrelativoModel(datosVenta.tipoComprobante);
    const siguienteCorrelativo = correlativoDB[0].ultimoNumero + 1;

    // 3. Verificar datos del cliente
    const cliente = datosVenta.datosCliente || {};
    const montoTotal = datosVenta.total || 0;

    // Aquí asumimos que tipoComprobante 2 = factura (ejemplo, ajusta según tu BD)
    const esFactura = datosVenta.tipoComprobante === 2;

    if (
        (!cliente.tipoDoc || !cliente.numeroDoc) && // si no hay datos cliente
        montoTotal < 700 &&                        // y es menor a 700
        !esFactura                                 // y no es factura
    ) {
        datosVenta.datosCliente = {
            tipoDoc: "-", // SUNAT: Varios
            numeroDoc: "00000000",
            nombreCliente: "Consumidor final"
        };
    } else {
        // Si viene con DNI válido, consultamos el nombre desde la API
        if (cliente.tipoDoc === 1 && cliente.numeroDoc) {
            try {
                const datosAPI = await consultarDNI(cliente.numeroDoc);

                if (datosAPI && datosAPI.nombres) {
                    // Construir apellidos y nombres
                    datosVenta.datosCliente.nombreCliente = `${datosAPI.apellidoPaterno} ${datosAPI.apellidoMaterno} ${datosAPI.nombres}`;
                }
            } catch (error) {
                console.error("Error al consultar el DNI:", error.message);
                // Si falla, dejamos el nombre como lo envió el frontend
            }
        }
    }

    // 4. Guardar en datosDB
    datosDB.numeroCorrelativo = siguienteCorrelativo;

    // 5. Agregar fecha de emisión al objeto venta
    datosVenta.fechaEmision = generarFechaActual();
    // 6. Calcular montos relacionados al IGV
    const porcentajeIGV = 18.00;
    const totalGravada = +(montoTotal / (1 + porcentajeIGV / 100)).toFixed(2);
    const totalIGV = +(montoTotal - totalGravada).toFixed(2);

    datosVenta.porcentajeIGV = porcentajeIGV;
    datosVenta.totalGravada = totalGravada;
    datosVenta.totalIgv = totalIGV;
    datosVenta.total = montoTotal;


    // 7. Formatear la venta con serie + correlativo
    const dataFormateada = formatearVenta(datosVenta, datosDB);

    return dataFormateada;
};




/*Obtener ventas (paginacion de 20 en 20)
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
};*/

module.exports = {
    registrarVentasService
};