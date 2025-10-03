const { CODIGOS_SUNAT } = require('../../config/constantes');

// Importamos helpers
const generarFechaActual = require("../generarFechaActual");
const { normalizarCliente } = require("./clienteHelpers");
const { calcularMontosTotales, validarMontoMinimo } = require("./calculosFinancieros");
const { obtenerProductosConDatos, validarProductos } = require("./calculosProductos");

function obtenerCodigoSunat(idTipoDocumento) {
  const mapeo = {
    1: CODIGOS_SUNAT.TIPOS_DOCUMENTO.DNI,      // DNI
    2: CODIGOS_SUNAT.TIPOS_DOCUMENTO.PASAPORTE, // PASAPORTE
    3: CODIGOS_SUNAT.TIPOS_DOCUMENTO.CARNET_EXTRANJERIA, // CARNÉ EXTRANJERÍA
    4: CODIGOS_SUNAT.TIPOS_DOCUMENTO.RUC       // RUC
  };

  return mapeo[idTipoDocumento] || CODIGOS_SUNAT.TIPOS_DOCUMENTO.DNI;
}

// Catálogo temporal de productos
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

function formatearVenta(datosFront, datosDB) {
  return {
    operacion: "generar_comprobante",
    tipo_de_comprobante: datosFront.tipoComprobante,
    serie: datosDB.serie,
    numero: datosDB.numeroCorrelativo,
    sunat_transaction: CODIGOS_SUNAT.TRANSACCIONES.VENTA_INTERNA,
    cliente_tipo_de_documento: obtenerCodigoSunat(datosFront.datosCliente.tipoDoc),
    cliente_numero_de_documento: datosFront.datosCliente.numeroDoc,
    cliente_denominacion: datosFront.datosCliente.nombreCliente,
    cliente_direccion: datosFront.datosCliente.direccion,
    cliente_email: datosFront.datosCliente.email,
    fecha_de_emision: datosFront.fechaEmision,
    moneda: CODIGOS_SUNAT.MONEDA.SOLES,
    porcentaje_de_igv: datosFront.porcentajeIGV,
    total_gravada: datosFront.totalGravada,
    total_igv: datosFront.totalIGV,
    total: datosFront.total,
    items: datosFront.productos
  };
}

// Calcular el total de una venta
function calcularTotalVenta(productosCalculados) {
  const total = productosCalculados.reduce((sum, producto) => sum + producto.total, 0);
  return Number(total.toFixed(2));
}

// Procesar y formatear la venta para Nubefact
function procesarVenta(datosVenta, datosComprobante) {
  // Validar productos
  validarProductos(datosVenta.productos, productos);

  // Procesar productos (calcular totales de cada item)
  datosVenta.productos = obtenerProductosConDatos(datosVenta.productos, productos);

  // Calcular total
  const totalVenta = calcularTotalVenta(datosVenta.productos);
  validarMontoMinimo(totalVenta);

  // Calcular montos de IGV, gravada, etc.
  const montos = calcularMontosTotales(totalVenta);
  Object.assign(datosVenta, montos);

  // Normalizar cliente
  datosVenta.datosCliente = normalizarCliente(
    datosVenta.datosCliente,
    datosVenta.tipoComprobante
  );

  // Agregar fecha de emisión
  datosVenta.fechaEmision = generarFechaActual();

  // Formatear datos finales
  return formatearVenta(datosVenta, {
    serie: datosComprobante.serie,
    numeroCorrelativo: datosComprobante.siguienteCorrelativo
  });
}

module.exports = {
  procesarVenta
};