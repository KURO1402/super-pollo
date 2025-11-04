const pool = require("../../../config/conexionDB");

const registrarVentaModel = async (datos) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const {
      numeroDocumentoCliente,
      nombreCliente,
      fechaEmision,
      fechaVencimiento,
      porcentajeIGV,
      totalGravada,
      totalIGV,
      totalVenta,
      idMedioPago,
      idTipoComprobante,
      idUsuario,
      numeroCorrelativo,
      enlaceNubefact,
      urlComprobantePDF,
      urlComprobanteXML,
      codigoHash,
      keyNubefact,
      aceptadaPorSunat,
      estadoSunat,
      sunatResponseCode
    } = datos;

    const [rows] = await conexion.execute(
      `CALL registrarVentaYComprobante(
        ?,?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?
      );`,
      [
        numeroDocumentoCliente,
        nombreCliente,
        fechaEmision,
        fechaVencimiento,
        porcentajeIGV,
        totalGravada,
        totalIGV,
        totalVenta,
        idMedioPago,
        idTipoComprobante,
        idUsuario,
        numeroCorrelativo,
        enlaceNubefact,
        urlComprobantePDF,
        urlComprobanteXML,
        codigoHash,
        keyNubefact,
        aceptadaPorSunat,
        estadoSunat,
        sunatResponseCode
      ]
    );

    return rows[0][0];

  } catch (err) {
    console.error("Error en registrarVentaModel:", err.message);
    throw new Error("Error al registrar la venta y comprobante en la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

const insertarDetalleVentaModel = async ({
  cantidadProducto,
  valorUnitario,
  precioUnitario,
  subtotal,
  igv,
  totalProducto,
  idVenta,
  idProducto
}) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [result] = await conexion.execute(
      "CALL insertarDetalleVenta(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        cantidadProducto,
        valorUnitario,
        precioUnitario,
        subtotal,
        igv,
        totalProducto,
        idVenta,
        idProducto
      ]
    );

    return result[0][0].mensaje;

  } catch (err) {
    throw new Error("Error al registrar el detalle de venta en la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

const contarMedioPagoModel = async (idMedioPago) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL contarMedioPagoPorId(?)`, [idMedioPago]);

    return rows[0][0]?.total;
  } catch (err) {
    throw new Error("Error al contar medio de pago por ID");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerComprobantePorIdModel = async (idComprobante) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [rows] = await conexion.query(
      `CALL obtenerComprobantePorId(?)`,
      [idComprobante]
    );

    return rows[0][0];

  } catch (err) {
    throw new Error("Error al obtener comprobante por ID");
  } finally {
    if (conexion) conexion.release();
  }
};

const actualizarComprobanteAnuladoModel = async ({
  idComprobante,
  enlaceNubefact,
  urlComprobanteXML,
  keyNubefact,
  aceptadaPorSunat,
  estadoSunat,
  sunatResponseCode
}) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [result] = await conexion.execute(
      "CALL actualizarComprobanteAnulado(?, ?, ?, ?, ?, ?, ?)",
      [
        idComprobante,
        enlaceNubefact,
        urlComprobanteXML,
        keyNubefact,
        aceptadaPorSunat,
        estadoSunat,
        sunatResponseCode
      ]
    );

    return result[0][0]?.mensaje;

  } catch (err) {
    throw Object.assign(
      new Error("No se pudo actualizar el comprobante en la base de datos."),
      { status: 500 }
    );

  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerResumenVentasModel = async (limit, offset) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerResumenVentas(?, ?)",
      [limit, offset]
    );
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener resumen de ventas.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerResumenVentaPorIdModel = async (idVenta) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerResumenVentaPorId(?)",
      [idVenta]
    );
    return result[0][0];
  } catch (err) {
    throw new Error("Error al obtener resumen de venta por ID.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerResumenVentasPorRangoFechaModel = async (fechaInicio, fechaFin, limit, offset) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerResumenVentasPorRangoFecha(?, ?, ?, ?)",
      [fechaInicio, fechaFin, limit, offset]
    );
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener ventas por rango de fecha.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerResumenVentasPorNombreUsuarioModel = async (busqueda, limit, offset) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerResumenVentasPorNombreUsuario(?, ?, ?)",
      [busqueda, limit, offset]
    );
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener ventas por nombre de usuario.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerVentasPorComprobanteModel = async (busqueda, limit, offset) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerVentasPorComprobante(?, ?, ?)",
      [busqueda, limit, offset]
    );
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener ventas por comprobante.");
  } finally {
    if (conexion) conexion.release();
  }
};


const obtenerResumenVentasPorAceptacionSunatModel = async (aceptadaSunat, limit, offset) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerResumenVentasPorAceptacionSunat(?, ?, ?)",
      [aceptadaSunat, limit, offset]
    );
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener ventas por aceptación SUNAT.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerEstadosSunatModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [result] = await conexion.execute("CALL obtenerEstadosSunat()");

    return result[0];

  } catch (err) {
    throw new Error("Error al obtener estados de sunat.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerMediosPagoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerMediosPago()");
        return result[0];
    } catch (error) {
        throw error;
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerDetalleVentaPorIdVentaModel = async (idVenta) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerDetalleVentaPorIdVenta(?)",
      [idVenta]
    );
    return result[0]; 
  } catch (err) {
    throw new Error("Error al obtener detalle de la venta.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerComprobantePorIdVentaModel = async (idVenta) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.execute(
      "CALL obtenerComprobantePorIdVenta(?)",
      [idVenta]
    );
    return result[0]; 
  } catch (err) {
    throw new Error("Error al obtener comprobante de la venta.");
  } finally {
    if (conexion) conexion.release();
  }
};

module.exports = {
  registrarVentaModel,
  insertarDetalleVentaModel,
  contarMedioPagoModel,
  obtenerComprobantePorIdModel,
  actualizarComprobanteAnuladoModel,
  obtenerResumenVentasModel,
  obtenerResumenVentaPorIdModel,
  obtenerResumenVentasPorRangoFechaModel,
  obtenerResumenVentasPorNombreUsuarioModel,
  obtenerVentasPorComprobanteModel,
  obtenerResumenVentasPorAceptacionSunatModel,
  obtenerEstadosSunatModel,
  obtenerMediosPagoModel,
  obtenerDetalleVentaPorIdVentaModel,
  obtenerComprobantePorIdVentaModel
};
