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


function formatearVenta(datosFront, datosDB) {
  const cliente = normalizarCliente(datosFront.datosCliente, datosFront.tipoComprobante)
  return {
    operacion: "generar_comprobante",
    tipo_de_comprobante: datosFront.tipoComprobante,
    serie: datosDB.serie,
    numero: datosDB.ultimoCorrelativo,
    sunat_transaction: CODIGOS_SUNAT.TRANSACCIONES.VENTA_INTERNA,
    cliente_tipo_de_documento: obtenerCodigoSunat(cliente.tipoDoc),
    cliente_numero_de_documento: cliente.numeroDoc,
    cliente_denominacion: cliente.nombreCliente,
    cliente_direccion: cliente.direccion,
    cliente_email: cliente.email,
    /*fecha_de_emision: datosFront.fechaEmision,
    moneda: CODIGOS_SUNAT.MONEDA.SOLES,
    porcentaje_de_igv: datosFront.porcentajeIGV,
    total_gravada: datosFront.totalGravada,
    total_igv: datosFront.totalIGV,
    total: datosFront.total,
    items: datosFront.productos*/
  };
}

module.exports = {
  formatearVenta
};