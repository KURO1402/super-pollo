const pool = require("../../../config/conexionDB");

const registrarMovimientoStockModel = async (idInsumo, cantidad, tipoMovimiento, detalles, idUsuario, idVenta = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await pool.query(
            "CALL registrarMovimientoStock(?, ?, ?, ?, ?, ?)",
            [idInsumo, cantidad, tipoMovimiento, detalles, idVenta, idUsuario]
        );

        return result[0][0]?.mensaje; 

    } catch (err) {
        throw new Error("Error al registrar el movimiento de stock.");

    } finally {
        if (conexion) conexion.release();

    }
};
const obtenerMovimientosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {

        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL obtenerMovimientos(?, ?)", [limit, offset]);

        return result[0]; 
        
    } catch (error) {
        throw new Error("Error al obtener movimimientos de la base de datos.");

    } finally {
        if (conexion) conexion.release();
    }
};

const buscarMovimientosPorInsumoModel = async (nombreInsumo, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL buscarMovimientosPorInsumo(?, ?, ?)",
            [nombreInsumo, limit, offset]
        );
        return result[0];
    } catch (error) {
        throw new Error("Error al buscar movimiento de la base de datos.");

    } finally {
        if (conexion) conexion.release();
    }
};

const buscarMovimientosPorUsuarioModel = async (nombreApellido, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL buscarMovimientosPorUsuario(?, ?, ?)",
            [nombreApellido, limit, offset]
        );
        return result[0];
    } catch (error) {
        throw new Error("Error al buscar movimiento de la base de datos.");

    } finally {
        if (conexion) conexion.release();
    }
};

const buscarMovimientosPorFechaModel = async (fechaInicio, fechaFin, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL buscarMovimientosPorFecha(?, ?, ?, ?)",
            [fechaInicio, fechaFin, limit, offset]
        );
        return result[0];
    } catch (error) {
        throw new Error("Error al buscar movimiento de la base de datos.");

    } finally {
        if (conexion) conexion.release();
    }
};

const buscarMovimientosPorTipoModel = async (tipoMovimiento, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL buscarMovimientosPorTipo(?, ?, ?)",
            [tipoMovimiento, limit, offset]
        );
        return result[0];
    } catch (error) {
        throw new Error("Error al buscar movimiento de la base de datos.");

    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosPorVentaModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            "CALL obtenerMovimientosPorVenta(?)",
            [idVenta]
        );

        return result[0]; 
    } catch (error) {
        throw new Error("Error al obtener movimientos por venta de la base de datos.");
        
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    registrarMovimientoStockModel,
    obtenerMovimientosPaginacionModel,
    buscarMovimientosPorInsumoModel,
    buscarMovimientosPorUsuarioModel,
    buscarMovimientosPorFechaModel,
    buscarMovimientosPorTipoModel,
    obtenerMovimientosPorVentaModel
};
