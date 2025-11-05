const pool = require("../../../config/conexionDB");

const insertarInsumoModel = async (nombreInsumo, stockIncial, unidadMedida) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query("CALL insertarInsumo(?, ?, ?)", [nombreInsumo, stockIncial, unidadMedida]);
        return result[0][0]?.mensaje;
        
    } catch (err) {
        throw new Error("Error al insertar insumo");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        
        const [rows] = await conexion.execute("CALL obtenerInsumos()");
        
        return rows[0];
    } catch (err) {
        throw new Error("Error al obtener los insumos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute(
            "CALL obtenerInsumosPaginacion(?, ?)",
            [limit, offset]
        );

        return rows[0]; 
    } catch (err) {
        throw new Error("Error al obtener insumos con paginación");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumoIDModel = async (id) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
    const [rows] = await pool.execute("CALL obtenerInsumoPorID(?)", [id]);
    return rows[0][0]; 
    } catch (err) {
        throw new Error("Error al obtener al insumo");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerConteoInsumosPorNombreModel = async (nombreInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection(); 
        const [rows] = await conexion.execute("CALL obtenerConteoInsumosPorNombre(?)", [nombreInsumo]);
        
        return rows[0][0].cantidadInsumos; 
    } catch (err) {
        throw new Error("Error al obtener el conteo de insumos");
    } finally {
        if (conexion) conexion.release(); 
    }
};

const actualizarInsumoModel = async (idInsumo, nombreInsumo, unidadMedida) => {
    let conexion;
    try {
    const [result] = await pool.query(
        "CALL actualizarInsumo(?, ?, ?)",
        [idInsumo, nombreInsumo, unidadMedida]
    );
    return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error("Error al actualizar el insumo");
    } finally {
        if(conexion) conexion.release();
    }
};

const eliminarInsumoModel = async (idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL eliminarInsumo(?)", [idInsumo]);

        return result[0][0]?.mensaje;
    } catch (err) {
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
