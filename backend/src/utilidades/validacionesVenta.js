const { obtenerTiposComprobanteService } = require("../modulos/ventas/servicio/comprobantesServicio");
const { productos } = require("../modulos/productos/productosModelo");
const { validarDocumento, validarCorreo } = require("./validaciones");

const validarDatosVenta = async (datosVenta) => {
  if (!datosVenta || typeof datosVenta !== "object") {
    throw Object.assign(
      new Error("Se necesitan los datos de la venta para generar este mismo."),
      { status: 400 }
    );
  }
  const { tipoComprobante, datosCliente, productos } = datosVenta;

  if (!tipoComprobante || typeof tipoComprobante !== "number") {
    throw Object.assign(
      new Error("El tipo de comprobante es obligatorio."),
      { status: 400 }
    );
  }

  if (!datosCliente || typeof datosCliente !== "object") {
    throw Object.assign(
      new Error("Se necesitan datos del cliente."),
      { status: 400 }
    );
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;
  if (!tipoDoc || typeof tipoDoc !== "number") {
    throw Object.assign(
      new Error("Se necesita el tipo de documento del cliente."),
      { status: 400 }
    );
  };

  if (!numeroDoc || typeof numeroDoc !== "string") {
    throw Object.assign(
      new Error("Se necesita numero de documento del cliente."),
      { status: 400 }
    );
  }
  console.log(nombreCliente)
  if (!nombreCliente || typeof nombreCliente !== "string") {
    throw Object.assign(
      new Error("Se necesita el nombre del cliente."),
      { status: 400 }
    );
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    throw Object.assign(
      new Error("Se necesitan los productos para generar la venta."),
      { status: 400 }
    );
  }

  if (tipoComprobante === 1) {
    // Validar campos requeridos y tipoDoc = 4 (RUC)
    if (!direccionCliente || typeof direccionCliente !== "string" || tipoDoc !== 4) {
      throw Object.assign(
        new Error("Para facturas se requiere cliente con Razon social, RUC y direccion"),
        { status: 400 }
      );
    }
  }

  // Validar documento si se envía
  if (tipoDoc && numeroDoc) {
    try {
      validarDocumento(tipoDoc, numeroDoc);
    } catch (err) {
      throw Object.assign(
        new Error(`Documento del cliente inválido: ${err.message}`),
        { status: 400 }
      );
    }
  }

  // Validar correo si se envía
  if (correoCliente) {
    validarCorreo(correoCliente);
  }

  for (const producto of productos) {
    if (!producto.idProducto || producto.idProducto !== "number") {
      throw Object.assign(
        new Error("Cada producto debe tener un idProducto válido"),
        { status: 400 }
      );
    }

    if (!producto.cantidad || typeof producto.cantidad !== 'number') {
      throw Object.assign(
        new Error("Cada producto necesita una cantidad"),
        { status: 400 }
      );
    }
    if (producto.cantidad <= 0) {
      throw Object.assign(
        new Error("La cantidad de cada producto debe ser mayor a 0."),
        { status: 400 }
      );
    }
  }
};

module.exports = { validarDatosVenta };
