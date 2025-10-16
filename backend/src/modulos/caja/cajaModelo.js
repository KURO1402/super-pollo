//Importamos la conexión a la base de datos
const pool = require("../../config/conexionDB.js");

//Modelo para crear una nueva caja
const crearCajaModel = async (montoInicial, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL crearCajaConEvento(?, ?)", [montoInicial, usuarioId]);
        return result;
    } catch (err) {
        console.error("Error en crearCajaModel: ", err.message);
        throw new Error("Error al crear la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }      
};

//Modelo para cerrar una caja
const cerrarCajaModel = async (usuarioId) => {
    let conexion;

    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL cerrarCajaConEvento(?)", [usuarioId]);
        return result;
    } catch (err) {
        console.error("Error en cerrarCajaModel: ", err.message);
        throw new Error("Error al cerrar la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const consultarCajaAbiertaModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL consultarCajaAbierta()");
        return rows[0]; 
    } catch (err) {
        console.error("Error en consultarCajaAbiertaModel: ", err.message);
        throw new Error("Error al consultar la caja abierta en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
}

// Modelo para registrar un ingreso en caja
const registrarIngresoCajaModel = async (datos, usuarioId) => {

    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL registrarIngresoCaja(?, ?, ?)", [monto, descripcion, usuarioId]);
        return result;
    } catch (err) {
        console.error("Error en registrarIngresoCajaModel: ", err.message);
        throw new Error("Error al registrar el ingreso en caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Procedimiento para registrar un egreso en caja
const registrarEgresoCajaModel = async (datos, usuarioId) => {
    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL registrarEgresoCaja(?, ?, ?)", [monto, descripcion, usuarioId]);
        return result;
    } catch (err) {
        console.error("Error en registrarEgresoCajaModel: ", err.message);
        throw new Error("Error al registrar el egreso en caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para registrar un arqueo de caja
const registrarArqueoCajaModel = async (montoFisico, diferencia, estadoArqueo, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL registrarArqueoCaja(?, ?, ?, ?)", [usuarioId, montoFisico, diferencia, estadoArqueo]);
        return result;
    } catch (err) {
        console.error("Error en registrarArqueoCajaModel: ", err.message);
        throw new Error("Error al registrar el arqueo de caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para obtener los movimientos de una caja específica
const obtenerMovimientosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerMovimientosPorCaja(?)", [cajaId]);
        return rows[0];
    } catch (err) {
        console.error("Error en obtenerMovimientosPorCajaModel: ", err.message);
        throw new Error("Error al obtener los movimientos de la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para obtener los movimientos de caja
const obtenerUltimosMovimientosCajaModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerUltimosMovimientosCaja(?, ?)", [limit, offset]);
        return rows[0];
    } catch (err) {
        console.error("Error en obtenerUltimosMovimientosCajaModel: ", err.message);
        throw new Error("Error al obtener los últimos movimientos de caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = { 
    crearCajaModel, 
    cerrarCajaModel, 
    consultarCajaAbiertaModel, 
    registrarIngresoCajaModel,
    registrarEgresoCajaModel,
    registrarArqueoCajaModel,
    obtenerMovimientosPorCajaModel,
    obtenerUltimosMovimientosCajaModel
}