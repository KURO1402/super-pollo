const pool = require("../../../config/conexionDB");

const obtenerTiposComprobantesModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerTiposComprobante()");

    return rows[0]; 
  } catch (err) {
    throw new Error("Error al obtener los tipos de comprobante de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerSerieComprobanteModel = async (idComprobante) => {
  let conexion;
  try {
    idComprobante
    conexion = await pool.getConnection();
    const [rows] = await conexion.query(`CALL obtenerSeriePorTipoComprobante(?)`, [idComprobante]);

    return rows[0];
  } catch (err) {
    throw new Error("Error al obtener series de los comprobantes de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
}

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
    throw new Error("Error al obtener el último correlativo de la base de datos");
  } finally {
    if (conexion) conexion.release();
  }
};

const actualizarCorrelativoModel = async (idComprobante, nuevoCorrelativo) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    await conexion.query(
      `CALL actualizarCorrelativoSolo(?, ?)`,
      [idComprobante, nuevoCorrelativo]
    );

    return true; 
  } catch (err) {
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

