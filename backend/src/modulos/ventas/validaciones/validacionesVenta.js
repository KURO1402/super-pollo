const { validarDocumento, validarCorreo } = require("../../../utilidades/validaciones");
const { contarTipoDocumentoPorIdModel } = require("../../usuarios/usuarioModelo");
const { obtenerProductoPorIdModel, obtenerInsumosPorProductoModel } = require("../../inventario/modelo/productoModelo");
const { contarMedioPagoModel } = require("../modelo/ventasModelo");

const validarDatosVentaBase = async (datosVenta, tipoEsperado, tipoNombre, requiereDireccion = false) => {
  if (!datosVenta || typeof datosVenta !== "object") {
    throw Object.assign(
      new Error("Se necesitan los datos de la venta para generar este mismo."),
      { status: 400 }
    );
  }

  const { tipoComprobante, datosCliente, productos, idMetodoPago} = datosVenta;

  if (!tipoComprobante || typeof tipoComprobante !== "number") {
    throw Object.assign(
      new Error("El tipo de comprobante es obligatorio."),
      { status: 400 }
    );
  }
  if (tipoComprobante !== tipoEsperado) {
    throw Object.assign(
      new Error(`El tipo de comprobante solo puede ser ${tipoNombre}.`),
      { status: 400 }
    );
  }

  if (!datosCliente || typeof datosCliente !== "object") {
    throw Object.assign(
      new Error("Se necesitan datos del cliente."),
      { status: 400 }
    );
  }

  if (!idMetodoPago || typeof idMetodoPago !== "number") {
    throw Object.assign(
      new Error("Se necesita el metodo de pago."),
      { status: 400 }
    );
  }
  const metodosPago = await contarMedioPagoModel(idMetodoPago);
  if (metodosPago === 0) {
    throw Object.assign(
      new Error("El metodo de pago no es valido."),
      { status: 400 }
    );
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;

  if (tipoDoc === undefined || tipoDoc === null || typeof tipoDoc !== "number") {
    throw Object.assign(
      new Error("Se necesita el tipo de documento del cliente."),
      { status: 400 }
    );
  }

  if (tipoEsperado === 1 && tipoDoc !== 3) {
    throw Object.assign(
      new Error("Solo se puede generar factura con RUC."),
      { status: 400 }
    );
  }

  if (!numeroDoc || typeof numeroDoc !== "string" || !numeroDoc.trim()) {
    throw Object.assign(
      new Error("Se necesita numero de documento del cliente."),
      { status: 400 }
    );
  }
  validarDocumento(tipoDoc, numeroDoc);

  const mensajeNombre = tipoEsperado === 1 ? "Se necesita un nombre o razon social del cliente." : "Se necesita el nombre del cliente.";
  if (!nombreCliente || typeof nombreCliente !== "string" || !nombreCliente.trim()) {
    throw Object.assign(new Error(mensajeNombre), { status: 400 });
  }

  if (requiereDireccion) {
    if (!direccionCliente || typeof direccionCliente !== "string" || !direccionCliente.trim()) {
      throw Object.assign(
        new Error("La direccion del cliente es obligatoria."),
        { status: 400 }
      );
    }
  } else if (direccionCliente) {
    if (typeof direccionCliente !== "string" || !direccionCliente.trim()) {
      throw Object.assign(
        new Error("La direccion del cliente no tiene formato valido."),
        { status: 400 }
      );
    }
  }

  if (correoCliente) {
    validarCorreo(correoCliente);
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    throw Object.assign(
      new Error("Se necesitan los productos para generar la venta."),
      { status: 400 }
    );
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
      if (!productoExistente) {
        erroresProductos.push(`El producto con ID ${producto.idProducto} no existe`);
      }
    } catch (err) {
      erroresProductos.push(`Error al validar el producto con ID ${producto.idProducto}: ${err.message}`);
    }

    if (erroresProductos.length > 0) {
      throw Object.assign(new Error("Uno o más productos ingresados no son válidos."), { status: 404 });
    }
  }
};

const validarStockInsumos = async (productos) => {
  for (const producto of productos) {
    const productoDB = await obtenerProductoPorIdModel(producto.idProducto);

    if (productoDB.usaInsumos === 1) {
      const insumos = await obtenerInsumosPorProductoModel(producto.idProducto);

      for (const insumo of insumos) {
        const requerido = producto.cantidad * insumo.cantidadUso;

        if (insumo.stockInsumo < requerido) {
          throw Object.assign(
            new Error(
              `Stock insuficiente para el insumo: ${insumo.nombreInsumo}, Stock actual: ${insumo.stockInsumo}, requerido: ${requerido}.`
            ),
            { status: 409 }
          );
        }
      }
    }
  }
};

const validarDatosVentaBoleta = async (datosVenta) => {
  await validarDatosVentaBase(datosVenta, 2, "boleta", false);
};

const validarDatosVentaFactura = async (datosVenta) => {
  await validarDatosVentaBase(datosVenta, 1, "factura", true);
};

module.exports = {
  validarDatosVentaBoleta,
  validarStockInsumos,
  validarDatosVentaFactura
};