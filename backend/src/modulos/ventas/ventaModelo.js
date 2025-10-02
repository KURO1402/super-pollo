//Importamos la conexion a la base de datos
const pool = require("../../config/conexionDB");


//Obtener la serie segun el tipo de comprobante
const obtenerSerieComprobanteModel = async (idComprobante) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL obtenerSeriePorTipoComprobante(?)`, [idComprobante]);

    // Como CALL devuelve arrays anidados, usamos rows[0]
    return rows[0];
  } catch (err) {
    console.error("Error en obtenerSerieComprobanteModel", err.message);
    throw new Error("Error al obtener series de los comprobantes de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
}

//Obtener el ultimo numero correlativo de un tipo de comprobante
const obtenerUltimoCorrelativoModel = async (idComprobante) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(
      `CALL obtenerUltimoCorrelativo(?)`,
      [idComprobante]
    );

    return rows[0];
  } catch (err) {
    console.error("Error en obtenerUltimoCorrelativoModel", err.message);
    throw new Error("Error al obtener el último correlativo de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

//Actualizar correlativo de venta 
const actualizarCorrelativoModel = async (idComprobante) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    // Llamar al procedimiento que incrementa correlativo
    await conexion.query(
      `CALL actualizarCorrelativoSolo(?)`,
      [idComprobante]
    );

    return true; // éxito
  } catch (err) {
    console.error("Error en actualizarCorrelativoModel", err.message);
    throw new Error("Error al actualizar el correlativo en la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

//Modelo para insertar una nueva venta usando el procedimiento almacenado
const insertarVentaModel = async (datosVenta) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    // Llamamos al procedimiento almacenado
    const [rows] = await conexion.query(
      `CALL insertarVenta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datosVenta.numeroDocumentoCliente,
        datosVenta.serie,
        datosVenta.numeroCorrelativo,
        datosVenta.sunatTransaccion,
        datosVenta.fechaEmision,
        datosVenta.fechaVencimiento,
        datosVenta.porcentajeIGV,
        datosVenta.totalGravada,
        datosVenta.totalIGV,
        datosVenta.totalVenta,
        datosVenta.aceptadaPorSunat,
        datosVenta.fechaRegistro = new Date(),
        datosVenta.urlCombrobantePDF,
        datosVenta.urlCombrobanteXML,
        datosVenta.idMedioPago,
        datosVenta.idTipoComprobante,
      ]
    );

    // rows[0] tendrá la respuesta, aunque insertarVenta no devuelve nada por ahora
    return rows;
  } catch (err) {
    console.error("Error en insertarVentaModel", err.message);
    throw new Error("Error al insertar la venta en la base de datos");
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


module.exports = {
  obtenerSerieComprobanteModel,
  obtenerUltimoCorrelativoModel,
  actualizarCorrelativoModel,
  insertarVentaModel,
  obtenerVentasModel,
  obtenerVentasIDModel,
};
