// Importamos la conexión a la base de datos
const pool = require("../../../config/conexionDB");

// Insertar nuevo insumo usando procedimiento
const insertarInsumoModel = async (nombreInsumo, stockIncial, unidadMedida) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query("CALL insertarInsumo(?, ?, ?)", [nombreInsumo, stockIncial, unidadMedida]);

        return result[0][0]?.mensaje;
        
    } catch (err) {
        console.error("Error en obtenerInsumoIDModel: ", err.message);
        throw new Error("Error al insertar insumo");
    } finally {
        if (conexion) conexion.release();
    }
};

// Obtener todos los insumos
const obtenerInsumosModel = async () => {
    const [rows] = await pool.query("CALL obtenerInsumos()");
    return rows[0]; // El resultado viene como un array anidado
};

// Obtener insumo por ID
const obtenerInsumoIDModel = async (id) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
    const [rows] = await pool.execute("CALL obtenerInsumoPorID(?)", [id]);
    return rows[0][0]; // Devuelve la primera fila del primer resultado
    } catch (err) {
        console.error("Error en obtenerInsumoIDModel: ", err.message);
        throw new Error("Error al obtener al insumo");
    } finally {
        if (conexion) conexion.release();
    }
};

// Actualizar insumo
const actualizarInsumoModel = async (id, datos) => {
    await pool.query(
        "CALL actualizarInsumo(?, ?, ?, ?, ?)",
        [id, datos.nombreInsumo, datos.stockInsumo, datos.unidadMedida, datos.categoriaProducto]
    );
    return { idInsumo: id, ...datos };
};

// Eliminar insumo
const eliminarInsumoModel = async (id) => {
    await pool.query("CALL eliminarInsumo(?)", [id]);
};

const obtenerStockActualModel = async (idInsumo) => {
    const [rows] = await pool.query('CALL obtenerStockActual(?)', [idInsumo]);
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
