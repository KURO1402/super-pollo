// Importamos la conexión a la base de datos
const pool = require("../../../config/conexionDB");

// Insertar nuevo insumo usando procedimiento
const insertarInsumoModel = async (nombreInsumo, stockIncial, unidadMedida) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        console.log(nombreInsumo, stockIncial, unidadMedida);
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
    let conexion;
    try {
        conexion = await pool.getConnection();
        
        const [rows] = await conexion.execute("CALL obtenerInsumos()");
        
        return rows[0]; // Primer resultado del SELECT
    } catch (err) {
        console.error("Error en obtenerInsumosModel:", err.message);
        throw new Error("Error al obtener los insumos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Obtener insumos por paginacion
const obtenerInsumosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute(
            "CALL obtenerInsumosPaginacion(?, ?)",
            [limit, offset]
        );

        return rows[0]; // Devuelve el listado paginado
    } catch (err) {
        console.error("Error en obtenerInsumosPaginacionModel:", err.message);
        throw new Error("Error al obtener insumos con paginación");
    } finally {
        if (conexion) conexion.release();
    }
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

const obtenerConteoInsumosPorNombreModel = async (nombreInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection(); // Obtener conexión
        const [rows] = await conexion.execute("CALL obtenerConteoInsumosPorNombre(?)", [nombreInsumo]);
        
        // Devuelve el conteo que está en la primera fila del primer resultado
        return rows[0][0].cantidadInsumos; 
    } catch (err) {
        console.error("Error en obtenerConteoInsumosPorNombreModel: ", err.message);
        throw new Error("Error al obtener el conteo de insumos");
    } finally {
        if (conexion) conexion.release(); // Liberar conexión
    }
};

// Actualizar insumo
const actualizarInsumoModel = async (idInsumo, nombreInsumo, unidadMedida) => {
    let conexion;
    console.log(nombreInsumo);
    try {
    const [result] = await pool.query(
        "CALL actualizarInsumo(?, ?, ?)",
        [idInsumo, nombreInsumo, unidadMedida]
    );
    return result[0][0]?.mensaje;

    } catch (err) {
        console.error("Error en actualizarInsumoModel: ", err.message);
        throw new Error("Error al actualizar el insumo");
    } finally {
        if(conexion) conexion.release();
    }
};

// Eliminar insumo
const eliminarInsumoModel = async (idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL eliminarInsumo(?)", [idInsumo]);

        return result[0][0]?.mensaje;
    } catch (err) {
        console.error("Error en eliminarInsumoModel: ", err.message);
        throw new Error("Error al eliminar el insumo");
    } finally {
        if(conexion) conexion.release();
    } 
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
    obtenerInsumosPaginacionModel,
    obtenerInsumoIDModel,
    obtenerConteoInsumosPorNombreModel,
    actualizarInsumoModel,
    eliminarInsumoModel,
    obtenerStockActualModel
};
