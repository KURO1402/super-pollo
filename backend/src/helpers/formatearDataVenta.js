function obtenerCodigoSunat(idTipoDocumento) {
  switch (idTipoDocumento) {
    case 1: // DNI
      return "1";
    case 2: // PASAPORTE
      return "7";
    case 3: // CARNÉ DE EXTRANJERÍA
      return "4";
    case 4: // RUC
      return "6";
  }
}

const formatearVenta = (datosFront, datosDB) => {
    // Estructura EXACTA que espera Nubefact
    return {
        operacion: "generar_comprobante",
        tipo_de_comprobante: datosFront.tipoComprobante,
        serie: datosDB.serie,
        numero: datosDB.numeroCorrelativo,
        sunat_transaction: 1,
        cliente_tipo_de_documento: obtenerCodigoSunat(datosFront.datosCliente.tipoDoc),
        cliente_numero_de_documento: datosFront.datosCliente.numeroDoc,
        cliente_denominacion: datosFront.datosCliente.nombreCliente,
        fecha_de_emision: datosFront.fechaEmision,
        moneda: 1,
        porcentaje_de_igv: datosFront.porcentajeIGV,
        total_gravada: datosFront.totalGravada,
        total_igv: datosFront.totalIgv,
        total: datosFront.total,
        items: datosFront.productos
    };
};

module.exports = {
    formatearVenta
}