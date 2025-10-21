// Importamos la conexión a la base de datos
const db = require("../../../config/conexionDB");

// Insertar nuevo insumo usando procedimiento
const insertarInsumoModel = async (datos) => {
    await db.query(
        "CALL insertarInsumo(?, ?, ?, ?)",
        [datos.nombreInsumo, datos.stockInsumo, datos.unidadMedida, datos.categoriaProducto]
    );

    return { mensaje: "Insumo insertado correctamente" };
};

// Obtener todos los insumos
const obtenerInsumosModel = async () => {
    const [rows] = await db.query("CALL obtenerInsumos()");
    return rows[0]; // El resultado viene como un array anidado
};

// Obtener insumo por ID
const obtenerInsumoIDModel = async (id) => {
    const [rows] = await db.query("CALL obtenerInsumoPorID(?)", [id]);
    return rows[0][0]; // Devuelve la primera fila del primer resultado
};

// Actualizar insumo
const actualizarInsumoModel = async (id, datos) => {
    await db.query(
        "CALL actualizarInsumo(?, ?, ?, ?, ?)",
        [id, datos.nombreInsumo, datos.stockInsumo, datos.unidadMedida, datos.categoriaProducto]
    );
    return { idInsumo: id, ...datos };
};

// Eliminar insumo
const eliminarInsumoModel = async (id) => {
    await db.query("CALL eliminarInsumo(?)", [id]);
};

// Calcular stock actual (esto sigue siendo una consulta directa, no hay procedimiento para esto)
const obtenerStockActualModel = async (idInsumo) => {
    const [result] = await db.query(
        `SELECT 
            SUM(CASE 
                    WHEN tipoMovimiento = 'entrada' THEN cantidadMovimiento 
                    ELSE -cantidadMovimiento 
                END) AS stock
         FROM movimientosstock
         WHERE idInsumo = ?`,
        [idInsumo]
    );
    return result[0].stock || 0;
};

// Exportamos todos los modelos
module.exports = {
    insertarInsumoModel,
    obtenerInsumosModel,
    obtenerInsumoIDModel,
    actualizarInsumoModel,
    eliminarInsumoModel,
    obtenerStockActualModel
};
