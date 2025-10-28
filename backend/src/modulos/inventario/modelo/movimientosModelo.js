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
const listarMovimientosModel = async () => {
    const [rows] = await pool.query("CALL listarMovimientos()");
    return rows[0]; // El resultado viene como array anidado
};

// Obtener movimientos por ID de insumo
const obtenerMovimientosPorInsumoModel = async (idInsumo) => {
    const [rows] = await pool.query("CALL obtenerMovimientosPorInsumo(?)", [idInsumo]);
    return rows[0];
};

//Eliminar movimiento 
const eliminarMovimientoModel = async(id) => {
    await pool.query("CALL eliminarMovimientoStock(?)", [id])
};

// Exportamos las funciones del modelo
module.exports = {
    registrarMovimientoStockModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
    eliminarMovimientoModel
};
