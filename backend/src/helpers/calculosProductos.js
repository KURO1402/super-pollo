const { CODIGOS_SUNAT } = require('../config/constantes');

// Obtener productos con cálculos de IGV
function obtenerProductosConDatos(productosSolicitados, catalogo) {
  validarProductos(productosSolicitados, catalogo);

  return productosSolicitados.map(({ productoId, cantidad }) => {
    const producto = catalogo.find(p => p.idProducto === productoId);
    return calcularMontosProducto(producto, cantidad);
  });
}

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
}

// Validar productos
function validarProductos(productosSolicitados, catalogo) {
  if (!Array.isArray(productosSolicitados) || productosSolicitados.length === 0) {
    const error = new Error("Debe enviar al menos un producto en la solicitud");
    error.status = 400;
    throw error;
  }

  // ✅ Validación estricta: todos los productos deben tener id y cantidad válida
  const todosValidos = productosSolicitados.every(
    ({ productoId, cantidad }) => productoId && cantidad > 0
  );

  if (!todosValidos) {
    const error = new Error("Todos los productos deben tener un productoId y una cantidad mayor a 0");
    error.status = 400;
    throw error;
  }

  // ✅ Validación catálogo: todos los productos deben existir
  const todosExisten = productosSolicitados.every(({ productoId }) =>
    catalogo.some(p => p.idProducto === productoId)
  );

  if (!todosExisten) {
    const error = new Error("Todos los productos deben existir en el catálogo");
    error.status = 400;
    throw error;
  }
}

module.exports = {
  obtenerProductosConDatos,
  validarProductos,
  calcularMontosProducto
};
