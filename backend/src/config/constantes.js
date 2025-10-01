// Códigos SUNAT
const CODIGOS_SUNAT = {
  TIPOS_DOCUMENTO: {
    DNI: "1",
    PASAPORTE: "7",
    CARNET_EXTRANJERIA: "4",
    RUC: "6"
  },
  
  TRANSACCIONES: {
    VENTA_INTERNA: 1
  },
  
  MONEDA: {
    SOLES: 1
  },
  
  IGV: {
    TASA: 0.18,
    PORCENTAJE: 18.00,
    TIPO: 1 // Gravado - Operación Onerosa
  },
  
  UNIDAD_MEDIDA: "NIU"
};

// Configuración de clientes
const CLIENTE_DEFAULT = {
  tipoDoc: "-",
  numeroDoc: "00000000",
  nombreCliente: "Consumidor final"
};

const MONTO_MINIMO_DOCUMENTO = 700;

const TIPOS_COMPROBANTE = {
  FACTURA: 2
};

module.exports = {
  CODIGOS_SUNAT,
  CLIENTE_DEFAULT,
  MONTO_MINIMO_DOCUMENTO,
  TIPOS_COMPROBANTE
};