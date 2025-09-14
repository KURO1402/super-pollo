//Importamos la conexion a la base de datos
const pool = require("../../config/conexionDB");

/**
 * Modelo para insertar una nueva venta en la base de datos
 * @param {Object} datosVenta - Objeto con la información de la venta
 * @returns {Object} resultado de la inserción
 */

const insertarVentaModel = async (datosVenta) => {
  let conexion; // variable que guardara la conexion temporal a la BD
  try {
    conexion = await pool.getConnection(); // aqui obtenemos la conexion del pool

    await conexion.beginTransaction(); //Iniciamos una transacción para asegurar consistencia (todo o nada)

    //ejecutamos el insert en la tabla ventascon los datos proporcionados
    const [result] = await conexion.execute(
      `INSERT INTO ventas(
            numeroDocumentoCliente, serie, numeroCorrelativo, sunatTransaccion,
            fechaEmision, fechaVencimiento, porcentajeIGV,
            totalGravada, totalIGV, totalVenta, aceptadaPorSunat,
            fechaRegistro, urlCombrobantePDF, urlCombrobanteXML,
            idMedioPago, idTipoComprobante
            )VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
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
        datosVenta.urlCombrobantePDF,
        datosVenta.urlCombrobanteXML,
        datosVenta.idMedioPago,
        datosVenta.idTipoComprobante,
      ] // Estos son los valores que se insertarán en la tabla 'ventas'
    );

    await conexion.commit(); //confirmamos la transaccion, los datos se guardan en la DB
    return result; // Devolvemos el resultado de la inserción
  } catch (err) {
    //si falla revertimos los cambios
    if(conexion) await conexion.rollback();
    // mostramos los errores
    console.error("Error en inserta ventas", err.message);//Error en consola
    throw new Error("Error al insertar la venta en la base de datos"); //Error que elcontrolador maneja
  } finally {
    //liberamos la conexion para que pueda reutilizarse
    if(conexion) conexion.release();
  }
};

//modelo para obtener las ventas con paginacion (20 en 20)

const obtenerVentasModel = async(offset = 0, limit = 20) => {
    let conexion; //guardamos al conexion
    try {
        conexion = await pool.getConnection(); //Obtenemos la conexion del pool
        const [rows] = await conexion.execute(
            `SELECT * FROM ventas ORDER BY fechaRegistro DESC LIMIT ? OFFSET ?`, // Consulta SQL para obtener ventas ordenadas por fecha (más recientes primero)
            [limit, offset]
        );
        return rows; // Devolvemos el array de ventas obtenidas
    } catch (err) {
        //mostramos los errores
        console.errror("Error en obtener la ventas", err.message); //consola
        throw new Error("Error al obtener ventas de la base de datos") //paar el controlador
    } finally {
        //Liberamos la conexion
        if(conexion) conexion.release();
    }
};

//Modelo para obtener una venta especifica
const obtenerVentasIDModel = async (idVenta) => {
    let conexion;//Obtenemos conexion del pool
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            `SELECT * FROM ventas WHERE idVenta = ?`, // Consulta SQL para obtener la venta con el ID especificado
            [idVenta]
        );
        return rows.length > 0 ? rows[0]: null; // Si existe la venta la devolvemos y si no retornamos null
    } catch (err) {
        console.error("Error al obtener venta especifica", err.message);
        throw new Error("Error al obtener venta por ID");
    } finally {
        if(conexion) conexion.release();
    }
};

//Aqui exportamos los modelos para usarlos en controladores u otras partes del sistema
module.exports = {
    insertarVentaModel,
    obtenerVentasModel,
    obtenerVentasIDModel,
};
