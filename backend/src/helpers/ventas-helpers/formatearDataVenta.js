const { CODIGOS_SUNAT } = require('../../config/constantes');
const { productos } = require("../../modulos/productos/productosModelo");

// Importamos helpers
const { generarFechaActual, generarHoraActual } = require("../generarTiempo");
const { normalizarCliente } = require("./clienteHelpers");
const { calcularMontosTotales } = require("./calculosFinancieros");
const { obtenerProductosConDatos } = require("./calculosProductos");

function obtenerCodigoSunat(idTipoDocumento) {
  const mapeo = {
    1: CODIGOS_SUNAT.TIPOS_DOCUMENTO.DNI,
    2: CODIGOS_SUNAT.TIPOS_DOCUMENTO.PASAPORTE,
    3: CODIGOS_SUNAT.TIPOS_DOCUMENTO.CARNET_EXTRANJERIA,
    4: CODIGOS_SUNAT.TIPOS_DOCUMENTO.RUC
  };
  return mapeo[idTipoDocumento] || CODIGOS_SUNAT.TIPOS_DOCUMENTO.DNI;
}

function formatearVenta(datosFront, datosDB) {
  const cliente = normalizarCliente(datosFront.datosCliente);
  const productosConDatos = obtenerProductosConDatos(datosFront.productos, productos);
  const montosTotales = calcularMontosTotales(productosConDatos, CODIGOS_SUNAT.IGV.PORCENTAJE);

  const venta = {
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
    enviar_automaticamente_al_cliente: !cliente.email ? false : true,
    fecha_de_emision: generarFechaActual(),
    hora_de_emision: generarHoraActual(),
    moneda: CODIGOS_SUNAT.MONEDA.SOLES,
    porcentaje_de_igv: montosTotales.porcentajeIGV,
    total_gravada: montosTotales.totalGravada,
    total_igv: montosTotales.totalIGV,
    total: montosTotales.total,
    items: productosConDatos
  };

  // ✅ Agregar solo si existe email
  /*if (cliente.email) {
    venta.cliente_email = cliente.email;
    venta.enviar_automaticamente_al_cliente = true;
  }
  if(cliente.direccion){
    venta.cliente_direccion = cliente.direccion;
  }*/

  return venta;
}

module.exports = {
  formatearVenta
};
