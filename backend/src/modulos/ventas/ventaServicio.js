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

const productos =  [
    {
      idProducto: 1,
      nombreProducto: "Pollo a la brasa entero",
      descripcionProducto: "Pollo entero sazonado al estilo tradicional, cocinado a la brasa.",
      imagen: "https://mi-polleria.com/imagenes/pollo_entero.jpg",
      unidad: "unidad",
      precio: 35.00,
      estado: "activo"
    },
    {
      idProducto: 2,
      nombreProducto: "1/2 Pollo a la brasa",
      descripcionProducto: "Media porción de pollo a la brasa con el mismo sabor clásico.",
      imagen: "https://mi-polleria.com/imagenes/medio_pollo.jpg",
      unidad: "unidad",
      precio: 20.00,
      estado: "activo"
    },
    {
      idProducto: 3,
      nombreProducto: "Presas adicionales",
      descripcionProducto: "Presas adicionales de pollo (pierna, ala, pechuga) cocinadas a la brasa.",
      imagen: "https://mi-polleria.com/imagenes/presas.jpg",
      unidad: "pieza",
      precio: 6.00,
      estado: "activo"
    },
    {
      idProducto: 4,
      nombreProducto: "Papas fritas familiares",
      descripcionProducto: "Papas fritas crocantes tamaño familiar, ideal para compartir.",
      imagen: "https://mi-polleria.com/imagenes/papas_familiares.jpg",
      unidad: "porción",
      precio: 8.00,
      estado: "activo"
    },
    {
      idProducto: 5,
      nombreProducto: "Ensalada fresca",
      descripcionProducto: "Ensalada de lechuga, tomate y zanahoria con vinagreta.",
      imagen: "https://mi-polleria.com/imagenes/ensalada.jpg",
      unidad: "porción",
      precio: 5.00,
      estado: "activo"
    },
    {
      idProducto: 6,
      nombreProducto: "Gaseosa 1.5L",
      descripcionProducto: "Botella de gaseosa de 1.5 litros (varios sabores disponibles).",
      imagen: "https://mi-polleria.com/imagenes/gaseosa.jpg",
      unidad: "botella",
      precio: 7.00,
      estado: "activo"
    },
    {
      idProducto: 7,
      nombreProducto: "Combo familiar",
      descripcionProducto: "1 Pollo entero + papas grandes + ensalada + gaseosa 1.5L.",
      imagen: "https://mi-polleria.com/imagenes/combo_familiar.jpg",
      unidad: "combo",
      precio: 48.00,
      estado: "activo"
    }
  ];

  const obtenerProductosConDatos = (solicitados, catalogo) => {
    return solicitados.map(({ productoId, cantidad }) => {
      const producto = catalogo.find(p => p.idProducto === productoId);
      if (!producto) return null;
  
      return {
        descripcion: producto.nombreProducto,
        valor_unitario: producto.precio,
        cantidad: cantidad
      };
    }).filter(Boolean);
  };
  

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

    const resultado = obtenerProductosConDatos(datosVenta.productos, productos);

    datosVenta.productos = resultado;

    // 8. Formatear la venta con serie + correlativo
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