// Códigos SUNAT
const CODIGOS_SUNAT = {
  TIPOS_DOCUMENTO: {
    DNI: "1",
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


const MONTO_MINIMO_DOCUMENTO = 700;

module.exports = {
  CODIGOS_SUNAT,
  MONTO_MINIMO_DOCUMENTO
};