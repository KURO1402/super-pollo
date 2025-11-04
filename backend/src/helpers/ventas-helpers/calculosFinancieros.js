
function calcularMontosTotales(productos, porcentajeIGV) {

  const montoTotal = productos.reduce((suma, producto) => suma + Number(producto.total || 0), 0);

  const totalGravada = +(montoTotal / (1 + porcentajeIGV / 100)).toFixed(2);
  const totalIGV = +(montoTotal - totalGravada).toFixed(2);

  return {
    totalGravada,
    totalIGV,
    porcentajeIGV,
    total: Number(montoTotal.toFixed(2))
  };
}

module.exports = {
  calcularMontosTotales
};