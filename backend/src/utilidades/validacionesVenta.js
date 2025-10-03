const { obtenerTiposComprobanteService } = require("../modulos/ventas/servicio/comprobantesServicio");

// Validar datos básicos de la venta
const validarDatosVenta = async (datosVenta) => {
  const tiposComprobante = await obtenerTiposComprobanteService(); // 👈 CORREGIDO (antes faltaban los paréntesis)

  if (!datosVenta) {
    const error = new Error('Se requieren datos de venta');
    error.status = 400;
    throw error;
  }

  if (!datosVenta.tipoComprobante) {
    const error = new Error('Tipo de comprobante es requerido');
    error.status = 400;
    throw error;
  }

  // Validar que el id de tipoComprobante realmente exista en la lista
  const existe = tiposComprobante.some(tc => Number(tc.idTipoComprobante) === Number(datosVenta.tipoComprobante));
  if (!existe) {
    const error = new Error('Tipo de comprobante no válido');
    error.status = 400;
    throw error;
  }

  // Validar cliente si es factura (ej: id=2)
  if (!datosVenta.datosCliente && Number(datosVenta.tipoComprobante) === 2) {
    const error = new Error('Los datos del cliente son necesarios para facturas');
    error.status = 400;
    throw error; 
  }

  if (!datosVenta.productos || !Array.isArray(datosVenta.productos) || datosVenta.productos.length === 0) {
    const error = new Error('La venta debe contener productos');
    error.status = 400;
    throw error;
  }
}

module.exports = {
  validarDatosVenta
}
