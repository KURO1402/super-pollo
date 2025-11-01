//Importamos la conexion a la base de datos
const pool = require("../../../config/conexionDB");

//Modelo para insertar una nueva venta usando el procedimiento almacenado
const registrarVentaModel = async (datos) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const {
      numeroDocumentoCliente,
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

    // Llamada al procedimiento almacenado que devuelve directamente los datos
    const [rows] = await conexion.execute(
      `CALL registrarVentaYComprobante(
        ?,?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?
      );`,
      [
        numeroDocumentoCliente,
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

    // El resultado está en rows[0][0] porque CALL devuelve un array de arrays
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
    console.error("Error en insertarDetalleVentaModel:", err.message);
    throw new Error("Error al registrar el detalle de venta en la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

/**
 * Modelo para obtener ventas con paginación (20 en 20)
 */
const obtenerVentasModel = async (pagina = 1) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL listarVentas(?)`, [pagina]);

    // Como CALL devuelve arrays anidados, usamos rows[0]
    return rows[0];
  } catch (err) {
    console.error("Error en obtenerVentasModel", err.message);
    throw new Error("Error al obtener ventas de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

/**
 * Modelo para obtener una venta específica por ID
 */
const obtenerVentasIDModel = async (idVenta) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL obtenerVenta(?)`, [idVenta]);

    // Devolvemos la primera fila si existe
    return rows[0][0] || null;
  } catch (err) {
    console.error("Error en obtenerVentasIDModel", err.message);
    throw new Error("Error al obtener venta por ID");
  } finally {
    if (conexion) conexion.release();
  }
};

const contarMedioPagoModel = async (idMedioPago) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL contarMedioPagoPorId(?)`, [idMedioPago]);

    // El resultado viene como un arreglo doble (por el CALL)
    return rows[0][0]?.total;
  } catch (err) {
    console.error("Error en contarMedioPagoModel:", err.message);
    throw new Error("Error al contar medio de pago por ID");
  } finally {
    if (conexion) conexion.release();
  }
};


module.exports = {
  registrarVentaModel,
  insertarDetalleVentaModel,
  obtenerVentasModel,
  obtenerVentasIDModel,
  contarMedioPagoModel
};
