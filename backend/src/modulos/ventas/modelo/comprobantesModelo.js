const pool = require("../../../config/conexionDB");

// Obtener todos los tipos de comprobante
const obtenerTiposComprobantesModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerTiposComprobante()");

    return rows[0]; // 👈 devuelve directamente los registros
  } catch (err) {
    console.error("Error al obtener los tipos de comprobante:", err.message);
    throw new Error("Error al obtener los tipos de comprobante de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

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

module.exports = {
    obtenerTiposComprobantesModel,
    obtenerSerieComprobanteModel,
    obtenerUltimoCorrelativoModel,
    actualizarCorrelativoModel
}

