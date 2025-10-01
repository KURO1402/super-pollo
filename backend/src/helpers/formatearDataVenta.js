const { CODIGOS_SUNAT } = require('../config/constantes');

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
  return {
    operacion: "generar_comprobante",
    tipo_de_comprobante: datosFront.tipoComprobante,
    serie: datosDB.serie,
    numero: datosDB.numeroCorrelativo,
    sunat_transaction: CODIGOS_SUNAT.TRANSACCIONES.VENTA_INTERNA,
    cliente_tipo_de_documento: obtenerCodigoSunat(datosFront.datosCliente.tipoDoc),
    cliente_numero_de_documento: datosFront.datosCliente.numeroDoc,
    cliente_denominacion: datosFront.datosCliente.nombreCliente,
    fecha_de_emision: datosFront.fechaEmision,
    moneda: CODIGOS_SUNAT.MONEDA.SOLES,
    porcentaje_de_igv: datosFront.porcentajeIGV,
    total_gravada: datosFront.totalGravada,
    total_igv: datosFront.totalIgv,
    total: datosFront.total,
    items: datosFront.productos
  };
}

module.exports = {
  formatearVenta,
  obtenerCodigoSunat
};