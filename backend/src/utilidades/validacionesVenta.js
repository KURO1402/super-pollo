const { obtenerTiposComprobanteService } = require("../modulos/ventas/servicio/comprobantesServicio");
const { productos } = require("../modulos/productos/productosModelo");
const { validarDocumento, validarCorreo } = require("./validaciones");

const validarDatosVenta = async (datosVenta) => {
  // ✅ 1. Validar existencia de datosVenta
  if (!datosVenta) {
    const error = new Error('Se requieren los datos de la venta');
    error.status = 400;
    throw error;
  }

  // ✅ 2. Validar tipo de comprobante
  if (!datosVenta.tipoComprobante) {
    const error = new Error('El tipo de comprobante es obligatorio');
    error.status = 400;
    throw error;
  }

  // Validar que el tipo de comprobante exista
  const tiposComprobante = await obtenerTiposComprobanteService();
  const existe = tiposComprobante.some(
    tc => Number(tc.idTipoComprobante) === Number(datosVenta.tipoComprobante)
  );
  if (!existe) {
    const error = new Error('Tipo de comprobante no válido');
    error.status = 400;
    throw error;
  }

  // ✅ 3. Manejo seguro de datosCliente (puede no existir)
  const cliente = datosVenta.datosCliente || {};
  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = cliente;

  // Si el comprobante es factura (id = 1), datosCliente es obligatorio
  if (Number(datosVenta.tipoComprobante) === 1) {
    if (!datosVenta.datosCliente) {
      const error = new Error('Los datos del cliente son obligatorios para facturas');
      error.status = 400;
      throw error;
    }

    // Validar campos requeridos y tipoDoc = 4 (RUC)
    if (!nombreCliente || !numeroDoc || !direccionCliente || tipoDoc !== 4) {
      const error = new Error('Para facturas se requiere cliente con RUC, nombre, número de documento y dirección');
      error.status = 400;
      throw error;
    }
  }

  // Validar documento si se envía
  if (tipoDoc && numeroDoc) {
    try {
      validarDocumento(tipoDoc, numeroDoc);
    } catch (err) {
      const error = new Error(`Documento del cliente inválido: ${err.message}`);
      error.status = 400;
      throw error;
    }
  }

  // Validar correo si se envía
  if (correoCliente) {
    validarCorreo(correoCliente);
  }

  // ✅ 4. Validar productos
  if (!Array.isArray(datosVenta.productos) || datosVenta.productos.length === 0) {
    const error = new Error('Debe incluir al menos un producto en la venta');
    error.status = 400;
    throw error;
  }

  for (const producto of datosVenta.productos) {
    if (!producto.idProducto) {
      const error = new Error("Cada producto debe tener un idProducto válido");
      error.status = 400;
      throw error;
    }

    if (typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
      const error = new Error("La cantidad de cada producto debe ser mayor a 0");
      error.status = 400;
      throw error;
    }

    const productoExistente = productos.find(p => p.idProducto === producto.idProducto);
    if (!productoExistente) {
      const error = new Error(`El producto con id ${producto.idProducto} no existe en el catálogo`);
      error.status = 400;
      throw error;
    }
  }
};

module.exports = { validarDatosVenta };
