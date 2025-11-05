const pool = require("../../config/conexionDB.js");

const crearCajaModel = async (montoInicial, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL crearCajaConEvento(?, ?)", [montoInicial, usuarioId]);
        return result[0][0]?.idCaja;
    } catch (err) {
        throw new Error("Error al crear la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }      
};

const cerrarCajaModel = async (usuarioId) => {
    let conexion;

    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL cerrarCajaConEvento(?)", [usuarioId]);
        return result;
    } catch (err) {
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
        throw new Error("Error al consultar la caja abierta en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
}

const registrarIngresoCajaModel = async (datos, usuarioId, idVenta = null) => {

    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL registrarIngresoCaja(?, ?, ?, ?)", [monto, descripcion, usuarioId, idVenta]);
        return rows[0][0]?.mensaje;
    } catch (err) {
        throw new Error("Error al registrar el ingreso en caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarEgresoCajaModel = async (datos, usuarioId,  idVenta = null) => {
    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL registrarEgresoCaja(?, ?, ?, ?)", [monto, descripcion, usuarioId, idVenta]);
        return rows[0][0]?.mensaje;
    } catch (err) {
        throw new Error("Error al registrar el egreso en caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarArqueoCajaModel = async (montos, diferencia, estadoArqueo, usuarioId) => {
    let conexion;
    try {
        const { montoFisico, montoTarjeta, montoBilleteraDigital, otros } = montos;
        conexion = await pool.getConnection();
        const [result] = await conexion.query("CALL registrarArqueoCaja(?, ?, ?, ?, ?, ?, ?)", [usuarioId, montoFisico, montoTarjeta, montoBilleteraDigital, otros, diferencia, estadoArqueo]);
        return result;
    } catch (err) {
        throw new Error("Error al registrar el arqueo de caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCajasModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerCajasCerradas(?, ?)", [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener las cajas cerradas en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosCajaModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerUltimosMovimientosCaja(?, ?)", [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener los últimos movimientos de caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerMovimientosPorCaja(?)", [cajaId]);
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener los movimientos de la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};


const obtenerArqueosCaja = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerArqueosCaja(?,?)", [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener los arqueos de la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerArqueosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query("CALL obtenerArqueosPorCaja(?)", [cajaId]);
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener los arqueos de la caja en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosCajaPorVentaModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL obtenerMovimientosCajaPorVenta(?)",
            [idVenta]
        );
        return result[0][0];
    } catch (err) {
        throw new Error("Error al obtener movimientos por venta de la base de datos.");
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
    obtenerMovimientosCajaModel,
    obtenerCajasModel,
    obtenerArqueosCaja,
    obtenerArqueosPorCajaModel,
    obtenerMovimientosCajaPorVentaModel
}