// Conexión a la BD
const pool = require("../../../config/conexionDB");

// Registrar movimiento y actualizar stock 
const registrarMovimientoStockModel = async (idInsumo, cantidad, tipoMovimiento, detalles, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await pool.query(
            "CALL registrarMovimientoStock(?, ?, ?, ?, ?)",
            [idInsumo, cantidad, tipoMovimiento, detalles, idUsuario]
        );

        return result[0][0]?.mensaje; // Mensaje del SELECT del SP

    } catch (err) {
        console.error("Error en registrarMovimientoStockModel:", err.message);
        throw new Error("Error al registrar el movimiento de stock.");
    } finally {
        if (conexion) conexion.release();
    }
};

// Listar todos los movimientos usando procedimiento almacenado
const obtenerMovimientosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        // Obtiene la conexión del pool
        conexion = await pool.getConnection();

        // Llama al procedimiento almacenado con los parámetros limit y offset
        const [result] = await conexion.execute("CALL obtenerMovimientos(?, ?)", [limit, offset]);

        // En MySQL, los resultados de CALL vienen en un array dentro de otro array
        return result[0]; // Devuelve el arreglo de movimientos
    } catch (error) {
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
    } finally {
        if (conexion) conexion.release();
    }
};

// Exportamos las funciones del modelo
module.exports = {
    registrarMovimientoStockModel,
    obtenerMovimientosPaginacionModel,
    buscarMovimientosPorInsumoModel,
    buscarMovimientosPorUsuarioModel,
    buscarMovimientosPorFechaModel,
    buscarMovimientosPorTipoModel
};
