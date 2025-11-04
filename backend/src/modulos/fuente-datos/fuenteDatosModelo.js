const pool = require("../../config/conexionDB.js");

const listarTipoDocumentoModel = async () => {
  try {
    const [rows] = await pool.execute("CALL listarTipoDocumento()");
    return rows[0];
  } catch (err) {
    throw new Error("Error en la base de datos al listar tipos de documento");
  }
};

const topProductosMasVendidosModel = async (fechaInicio, fechaFin) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.execute(
      "CALL topProductosMasVendidos(?, ?)",
      [fechaInicio, fechaFin]
    );
    return rows[0];
  } catch (err) {
    throw new Error("Error al obtener los productos mas vendidos");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerResumenVentasEgresosMensualModel = async (cantidadMeses) => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [rows] = await conexion.query(
      "CALL obtenerResumenVentasEgresosMensual(?)",
      [cantidadMeses]
    );

    return rows[0];
  } catch (err) {
    throw new Error("Error al obtener datos de ingresos y egresos de la base de datos.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerVentasHoyComparacionModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [rows] = await conexion.query("CALL obtenerVentasHoyComparacion()");

    return rows[0][0]; 
  } catch (err) {
    throw new Error("Error al obtener la comparativa de ventas.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerCantidadVentasHoyComparacionModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();

    const [rows] = await conexion.query("CALL obtenerCantidadVentasHoyComparacion()");

    return rows[0][0]; 
  } catch (err) {
    throw new Error("Error al obtener la comparativa de cantidad de ventas.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerReservasHoyComparacionModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerReservasHoyComparacion()");
    return rows[0][0]; 
  } catch (err) {
    throw new Error("Error al obtener la comparativa de reservas.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerBalanceGeneralAnualModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerBalanceGeneralAnual()");
    return rows[0][0]; 
  } catch (err) {
    throw new Error("Error al obtener el balance general anual.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerPorcentajeMediosPagoModel = async () => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerPorcentajeMediosPago()");
    return rows[0]; 
  } catch (err) {
    throw new Error("Error al obtener porcentaje de medios de pago.");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerVentasPorMesModel = async (cantidadMeses) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.query("CALL obtenerVentasPorMes(?)", [cantidadMeses]);
    return rows[0]; 
  } catch (err) {
    throw new Error("Error al obtener las ventas por mes.");
  } finally {
    if (conexion) conexion.release();
  }
};

module.exports = {
  listarTipoDocumentoModel,
  topProductosMasVendidosModel,
  obtenerResumenVentasEgresosMensualModel,
  obtenerVentasHoyComparacionModel,
  obtenerCantidadVentasHoyComparacionModel,
  obtenerReservasHoyComparacionModel,
  obtenerBalanceGeneralAnualModel,
  obtenerPorcentajeMediosPagoModel,
  obtenerVentasPorMesModel
};