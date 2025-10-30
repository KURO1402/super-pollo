const { validarDocumento, validarCorreo } = require("../../../utilidades/validaciones");
const { contarTipoDocumentoPorIdModel } = require("../../usuarios/usuarioModelo");
const { obtenerProductoPorIdModel } = require("../../inventario/modelo/productoModelo")

const validarDatosVentaBoleta = async (datosVenta) => {
  if (!datosVenta || typeof datosVenta !== "object") {
    throw Object.assign(
      new Error("Se necesitan los datos de la venta para generar este mismo."),
      { status: 400 }
    );
  }
  const { tipoComprobante, datosCliente, productos, metodoPago } = datosVenta;

  if (!tipoComprobante || typeof tipoComprobante !== "number") {
    throw Object.assign(
      new Error("El tipo de comprobante es obligatorio."),
      { status: 400 }
    );
  }
  if (tipoComprobante !== 2) {
    throw Object.assign(
      new Error("El tipo de comprobante comprobante solo puede ser boleta."),
      { status: 400 }
    );
  }

  if (!datosCliente || typeof datosCliente !== "object") {
    throw Object.assign(
      new Error("Se necesitan datos del cliente."),
      { status: 400 }
    );
  }

  if(!metodoPago || typeof metodoPago !== "string" || !metodoPago.trim()){
    throw Object.assign(
      new Error("Se necesita el metodo de pago."),
      { status: 400 }
    );
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;
  if (tipoDoc === undefined || tipoDoc === null || typeof tipoDoc !== "number") {
    throw Object.assign(
      new Error("Se necesita el tipo de documento del cliente."),
      { status: 400 }
    );
  };
  if (tipoDoc !== 0) {
    const totalTiposDoc = await contarTipoDocumentoPorIdModel(tipoDoc);
    if (totalTiposDoc === 0) {
      throw Object.assign(
        new Error("El tipo de documento del cliente no es válido."),
        { status: 400 }
      );
    }
  }


  if (!numeroDoc || typeof numeroDoc !== "string") {
    throw Object.assign(
      new Error("Se necesita numero de documento del cliente."),
      { status: 400 }
    );
  }

  validarDocumento(tipoDoc, numeroDoc);

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

  if (direccionCliente) {
    if (typeof direccionCliente !== "string" || !direccionCliente.trim() || direccionCliente === undefined || direccionCliente === null) {
      throw Object.assign(
        new Error("La direccion del cliente no tiene formato valido."),
        { status: 400 }
      );
    }
  }

  // Validar correo si se envía
  if (correoCliente) {
    validarCorreo(correoCliente);
  }

  let erroresProductos = [];

  for (const producto of productos) {
    if (!producto.idProducto || typeof producto.idProducto !== "number") {
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
   
    try {
      const productoExistente = await obtenerProductoPorIdModel(producto.idProducto);
      console.log(productoExistente);
      if (!productoExistente) {
        erroresProductos.push(`El insumo con ID ${producto.idProducto} no existe`);
      }
    } catch (err) {
      erroresProductos.push(`Error al validar el insumo con ID ${producto.idProducto}: ${err.message}`);
    }

    if (erroresProductos.length > 0) {
        throw Object.assign(new Error("Uno o más productos ingresados no son inválidos."), { status: 404 });
    }
  }
};

module.exports = { validarDatosVentaBoleta };
