const { CODIGOS_SUNAT } = require('../../config/constantes');

// Calcular montos totales con IGV
function calcularMontosTotales(montoTotal, porcentajeIGV = CODIGOS_SUNAT.IGV.PORCENTAJE) {
  const totalGravada = +(montoTotal / (1 + porcentajeIGV / 100)).toFixed(2);
  const totalIGV = +(montoTotal - totalGravada).toFixed(2);

  return {
    totalGravada,
    totalIGV,
    porcentajeIGV,
    total: montoTotal
  };
}

// Validar montos mínimos
function validarMontoMinimo(monto) {
  if (monto <= 0) {
    const error = new Error('El monto total debe ser mayor a 0');
    error.status = 400;
    throw error;
  }
}

module.exports = {
  calcularMontosTotales,
  validarMontoMinimo
};