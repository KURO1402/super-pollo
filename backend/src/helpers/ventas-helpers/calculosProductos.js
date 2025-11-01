const { CODIGOS_SUNAT } = require('../../config/constantes');

// Calcular montos individuales del producto
function calcularMontosProducto(producto, cantidad) {
  const precioConIGV = Number(producto.precio);
  const valorUnitario = precioConIGV / (1 + CODIGOS_SUNAT.IGV.TASA);

  const subtotal = valorUnitario * cantidad;
  const total = precioConIGV * cantidad;
  const igv = total - subtotal;

  return {
    unidad_de_medida: CODIGOS_SUNAT.UNIDAD_MEDIDA,
    descripcion: producto.nombreProducto,
    cantidad,
    valor_unitario: Number(valorUnitario.toFixed(2)),
    precio_unitario: Number(precioConIGV.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    tipo_de_igv: CODIGOS_SUNAT.IGV.TIPO,
    igv: Number(igv.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

// Obtener productos con cálculos de IGV
function obtenerProductosConDatos(productosSolicitados, catalogo) {

  return productosSolicitados.map(({ idProducto, cantidad }) => {
    const producto = catalogo.find(p => p.idProducto === idProducto);
    return calcularMontosProducto(producto, cantidad);
  });
}

module.exports = {
  obtenerProductosConDatos
};
