// Importamos los modelos
const {
    obtenerSerieComprobanteModel,
    obtenerUltimoCorrelativoModel
} = require('./ventaModelo');

// Importamos helpers
const { formatearVenta } = require("../../helpers/formatearDataVenta");
const generarFechaActual = require("../../helpers/generarFechaActual");
const { normalizarCliente } = require("../../helpers/clienteHelpers");
const { calcularMontosTotales, validarMontoMinimo } = require("../../helpers/calculosFinancieros");
const { obtenerProductosConDatos, validarProductos } = require("../../helpers/calculosProductos");

// Catálogo de productos (array temporal)
const productos = [
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

// Calcular el total sumando todos los productos
function calcularTotalVenta(productosCalculados) {
  const total = productosCalculados.reduce((sum, producto) => {
    return sum + producto.total;
  }, 0);
  
  return Number(total.toFixed(2));
}

// Validar datos básicos de la venta
function validarDatosVenta(datosVenta) {
  if (!datosVenta.tipoComprobante) {
    const error = new Error('Tipo de comprobante es requerido');
    error.status = 400;
    throw error;
  }

  if (!datosVenta.productos || !Array.isArray(datosVenta.productos) || datosVenta.productos.length === 0) {
    const error = new Error('La venta debe contener productos');
    error.status = 400;
    throw error;
  }
}

// Obtener datos del comprobante (serie y correlativo)
async function obtenerDatosComprobante(tipoComprobante) {
  try {
    const [serieDB, correlativoDB] = await Promise.all([
      obtenerSerieComprobanteModel(tipoComprobante),
      obtenerUltimoCorrelativoModel(tipoComprobante)
    ]);

    if (!serieDB || serieDB.length === 0) {
      const error = new Error('No se pudo obtener la serie del comprobante');
      error.status = 500;
      throw error;
    }

    if (!correlativoDB || correlativoDB.length === 0) {
      const error = new Error('No se pudo obtener el correlativo del comprobante');
      error.status = 500;
      throw error;
    }

    return {
      serie: serieDB[0].serie,
      siguienteCorrelativo: correlativoDB[0].ultimoNumero + 1
    };
  } catch (error) {
    // Si ya tiene status, lo mantenemos, sino le asignamos 500
    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
}

// Procesar la venta completa
async function procesarVenta(datosVenta, datosComprobante) {
  try {
    // Validar productos
    try {
      validarProductos(datosVenta.productos, productos);
    } catch (error) {
      error.status = 400;
      throw error;
    }

    // Procesar productos (esto calcula los montos individuales)
    datosVenta.productos = obtenerProductosConDatos(datosVenta.productos, productos);

    // Calcular el total sumando todos los productos
    const totalVenta = calcularTotalVenta(datosVenta.productos);
    
    // Validar que el total sea mayor a 0
    validarMontoMinimo(totalVenta);

    // Calcular montos (IGV, base imponible, etc.)
    const montos = calcularMontosTotales(totalVenta);
    Object.assign(datosVenta, montos);

    // Agregar fecha
    datosVenta.fechaEmision = generarFechaActual();

    // Formatear para Nubefact
    return formatearVenta(datosVenta, {
      serie: datosComprobante.serie,
      numeroCorrelativo: datosComprobante.siguienteCorrelativo
    });
  } catch (error) {
    // Si ya tiene status, lo mantenemos, sino le asignamos 500
    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
}

// Función principal del servicio
const registrarVentaService = async (datosVenta) => {
    try {
        // 1. Validaciones iniciales
        validarDatosVenta(datosVenta);

        // 2. Obtener datos del comprobante
        const datosComprobante = await obtenerDatosComprobante(datosVenta.tipoComprobante);

        // 👇 OBTENER PRODUCTOS TEMPORALMENTE PARA CALCULAR MONTO
        validarProductos(datosVenta.productos, productos);
        const productosCalculados = obtenerProductosConDatos(datosVenta.productos, productos);
        const montoTemporal = calcularTotalVenta(productosCalculados);

        // 3. Procesar cliente con el monto temporal
        datosVenta.datosCliente = normalizarCliente(
            datosVenta.datosCliente,
            datosVenta.tipoComprobante
        );

        // 4. Procesar venta completa
        const ventaProcesada = await procesarVenta(datosVenta, datosComprobante);

        return ventaProcesada;
    } catch (error) {
        console.error('Error en servicio de ventas:', error.message);
        
        if (!error.status) {
            error.status = 500;
        }
        
        throw error;
    }
};

module.exports = {
    registrarVentaService
};