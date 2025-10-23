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
    // Primero obtenemos el stock base desde la tabla insumos
    const [result] = await db.query(
        `SELECT stockInsumo 
         FROM insumos
         WHERE idInsumo = ?`,
        [idInsumo]
    );

    // Si no se encuentra el insumo, devolvemos 0
    if (result.length === 0) {
        return 0;
    }

    const stockBase = result[0].stockInsumo;

    // Ahora calculamos el movimiento neto de entradas y salidas
    const [movimientos] = await db.query(
        `SELECT 
            SUM(CASE 
                    WHEN tipoMovimiento = 'entrada' THEN cantidadMovimiento 
                    ELSE -cantidadMovimiento 
                END) AS movimientoNeto
         FROM movimientosstock
         WHERE idInsumo = ?`,
        [idInsumo]
    );

    // Si no hay movimientos, el stock neto es 0
    const movimientoNeto = movimientos[0].movimientoNeto || 0;

    // El stock final es el stock base más el movimiento neto
    const stockFinal = stockBase + movimientoNeto;

    //console.log(`Stock final calculado para idInsumo ${idInsumo}: ${stockFinal}`); // Log para depuración

    return stockFinal;
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
