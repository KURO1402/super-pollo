// Conexión a la BD
const pool = require("../../../config/conexionDB");

// Registrar movimiento y actualizar stock 
const registrarMovimientoStockModel = async (idInsumo, cantidad, tipoMovimiento, detalles, idUsuario, idVenta = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await pool.query(
            "CALL registrarMovimientoStock(?, ?, ?, ?, ?, ?)",
            [idInsumo, cantidad, tipoMovimiento, detalles, idVenta, idUsuario]
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
        console.error("Error en obtenerMovimientosPaginacionModel:", err.message);
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
        console.error("Error en buscarMovimientosPorInsumoModel:", err.message);
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
        console.error("Error en buscarMovimientosPorUsuarioModel:", err.message);
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
        console.error("Error en buscarMovimientosPorFechaModel:", err.message);
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
        console.error("Error en buscarMovimientosPorTipoModel:", err.message);
        throw new Error("Error al buscar movimiento de la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosPorVentaModel = async (idVenta) => {
    let conexion;
    try {
        // Obtener conexión del pool
        conexion = await pool.getConnection();

        // Llamar al procedimiento almacenado con el parámetro idVenta
        const [result] = await conexion.execute(
            "CALL obtenerMovimientosPorVenta(?)",
            [idVenta]
        );

        // Los resultados vienen en result[0]
        return result[0]; 
    } catch (error) {
        console.error("Error en obtenerMovimientosPorVentaModel:", err.message);
        throw new Error("Error al obtener movimientos por venta de la base de datos.");
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
    buscarMovimientosPorTipoModel,
    obtenerMovimientosPorVentaModel
};
