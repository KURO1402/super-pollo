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

const obtenerStockActualModel = async (idInsumo) => {
    const [rows] = await db.query('CALL obtenerStockActual(?)', [idInsumo]);
    const stockActual = rows[0][0].stockActual;
    return stockActual;
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
