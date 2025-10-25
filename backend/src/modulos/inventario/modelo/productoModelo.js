// Conexión a la BD
const pool = require("../../../config/conexionDB");

const insertarProductoModel = async (nombreProducto, descProducto, precio, usaInsumo, idImagen) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarProducto(?, ?, ?, ?, ?)", [nombreProducto, descProducto, precio, usaInsumo, idImagen]);

        const respuesta = result[0][0];

        return respuesta;

    } catch (err) {
        console.error("Error en insertarProductoModel: ", err.message);
        throw new Error("Error al registrar producto en la base de datos");
    } finally {
        if(conexion) conexion.release();
    }
};

// Modelo para insertar una cantidad de insumo para un producto
const insertarCantidadInsumoProductoModel = async (idProducto, idInsumo, cantidad) => {
    let conexion
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarCantidadInsumoProducto(?, ?, ?)", [idProducto, idInsumo, cantidad]);
        if(result[1].affectedRows === 0){
            throw new Error("No se registro a cantidad de insumos para un producto");
        };
        return true;
    } catch (err) {
        console.error("Error en insertarCantidadInsumoProductoModel: ", err.message);
        throw new Error("Error al registrar cantidad de insumos de un producto en la base de datos");
    } finally {
        if (conexion) conexion.release()
    }
};

// Modelo para validar que un nombre de producto ya este registrado en la bd
const validarProductoPorNombre = async (nombreProducto) => {
    let conexion
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL validarProductoPorNombre(?)", [nombreProducto]);
        return rows[0];
    } catch (err) {
        console.error("Error en validarProductoPorNombre: ", err.message);
        throw new Error("Error al validar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release()
    }
};

// Modelo para registrar una imagen de un producto
const registrarImagenProductoModel = async (urlImagen, publicId) => {
    let conexion
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarImagenProducto(?, ?)", [urlImagen, publicId]);
        return result[0][0].idInsertado;
    } catch (err) {
        console.error("Error en registrarImagenProductoModel: ", err.message);
        throw new Error("Error al validar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release()
    }
}

module.exports = {
    insertarProductoModel,
    insertarCantidadInsumoProductoModel,
    validarProductoPorNombre,
    registrarImagenProductoModel
}