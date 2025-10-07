const { obtenerTiposComprobanteService } = require("../modulos/ventas/servicio/comprobantesServicio");
const { productos } = require("../modulos/productos/productosModelo");
const { validarDocumento } = require("./validaciones");

// Validar datos básicos de la venta
const validarDatosVenta = async (datosVenta) => {

  // Validar que se envíen datos
  if (!datosVenta) {
    const error = new Error('Se requieren datos de venta como tipo de comprobante, datos del cliente y productos');
    error.status = 400;
    throw error;
  }

  // Validar tipo de comprobante
  if (!datosVenta.tipoComprobante) {
    const error = new Error('Tipo de comprobante es requerido');
    error.status = 400;
    throw error;
  }

  // Obtener tipos de comprobante para validación
  const tiposComprobante = await obtenerTiposComprobanteService();

  // Validar que el id de tipoComprobante realmente exista en la lista
  const existe = tiposComprobante.some(tc => Number(tc.idTipoComprobante) === Number(datosVenta.tipoComprobante));
  if (!existe) {
    const error = new Error('Tipo de comprobante no válido');
    error.status = 400;
    throw error;
  }

  let tipoDoc;
  let numeroDoc;

  // Validar cliente si es factura
  if (Number(datosVenta.tipoComprobante) === 1) {
    const cliente = datosVenta.datosCliente;

    // Verificar existencia del objeto cliente
    if (!cliente) {
      const error = new Error('Los datos del cliente son obligatorios para facturas');
      error.status = 400;
      throw error;
    }

    const { tipoDoc: docTipo, numeroDoc: docNumero, nombreCliente, direccionCliente } = cliente;

    // Validar campos requeridos y tipoDoc = 4 (RUC)
    if (!nombreCliente || !docNumero || !direccionCliente || docTipo !== 4) {
      const error = new Error('Para facturas se requiere cliente con RUC, nombre, número de documento y dirección');
      error.status = 400;
      throw error;
    }

    tipoDoc = docTipo;
    numeroDoc = docNumero;
  } else if (datosVenta.datosCliente) {
    // Si no es factura pero hay datos de cliente, igual validamos el documento si existe
    tipoDoc = datosVenta.datosCliente.tipoDoc;
    numeroDoc = datosVenta.datosCliente.numeroDoc;
  }

  // Validar tipo de documento y número de documento del cliente (si existen)
  if (tipoDoc && numeroDoc) {
    try {
      validarDocumento(tipoDoc, numeroDoc);
    } catch (err) {
      const error = new Error(`Documento del cliente inválido: ${err.message}`);
      error.status = 400;
      throw error;
    }
  }

  // Validar productos
  if (!datosVenta.productos || !Array.isArray(datosVenta.productos) || datosVenta.productos.length === 0) {
    const error = new Error('Se requiere al menos un producto en la venta');
    error.status = 400;
    throw error;
  }

  // Validar que cada producto tenga un idProducto válido
  datosVenta.productos.forEach((producto) => {
    if (!producto.idProducto) {
      const error = new Error("Se requiere que cada producto tenga un id válido");
      error.status = 400;
      throw error;
    }
  });

  // Validar que la cantidad de cada producto sea mayor a 0 y de tipo número
  datosVenta.productos.forEach((producto) => {
    if (typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
      const error = new Error("La cantidad de cada producto debe ser mayor a 0");
      error.status = 400;
      throw error;
    }
  });

  // Validar que los productos existan en el modelo
  datosVenta.productos.forEach((productoVenta) => {
    const productoExistente = productos.find(p => p.idProducto === productoVenta.idProducto);
    if (!productoExistente) {
      const error = new Error("Alguno o algunos de los productos no existe en el catálogo");
      error.status = 400;
      throw error;
    }
  });
};

module.exports = {
  validarDatosVenta
};
