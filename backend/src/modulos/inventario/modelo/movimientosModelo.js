// Conexión a la BD
const db = require("../../../config/conexionDB");

// Registrar movimiento y actualizar stock 
const registrarMovimientoModel = async (datosMovimiento) => {
    await db.query(
        "CALL registrarMovimientoStock(?, ?, ?, ?)",
        [
            datosMovimiento.idInsumo,
            datosMovimiento.tipoMovimiento,
            datosMovimiento.cantidadMovimiento,
            datosMovimiento.idUsuario
        ]
    );

    return {
        mensaje: "Movimiento registrado y stock actualizado correctamente"
    };
};

// Listar todos los movimientos usando procedimiento almacenado
const listarMovimientosModel = async () => {
    const [rows] = await db.query("CALL listarMovimientos()");
    return rows[0]; // El resultado viene como array anidado
};

// Obtener movimientos por ID de insumo
const obtenerMovimientosPorInsumoModel = async (idInsumo) => {
    const [rows] = await db.query("CALL obtenerMovimientosPorInsumo(?)", [idInsumo]);
    return rows[0];
};

//Eliminar movimiento 
const eliminarMovimientoModel = async(id) => {
    await db.query("CALL eliminarMovimientoStock(?)", [id])
};

// Exportamos las funciones del modelo
module.exports = {
    registrarMovimientoModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
    eliminarMovimientoModel
};
