// Conexión a la BD
const pool = require("../../../config/conexionDB");

const insertarProductoModel = async (nombreProducto, descProducto, precio, usaInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarProducto(?, ?, ?, ?)", [nombreProducto, descProducto, precio, usaInsumo]);

        if(result[1].affectedRows === 0){
            throw new Error("No se pudo registrar el producto");
        };

        const respuesta = result[0][0];
        return respuesta.idGenerado;

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
        if(result.affectedRows === 0){
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
const registrarImagenProductoModel = async (urlImagen, publicId, idProducto) => {
    let conexion
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL registrarImagenProducto(?, ?, ?)", [urlImagen, publicId, idProducto]);
        if(result.affectedRows === 0){
            throw new Error("No se pudo insertar la imagen del producto");
        }
        return true;
    } catch (err) {
        console.error("Error en registrarImagenProductoModel: ", err.message);
        throw new Error("Error al validar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release()
    }
};

//Modelo para actualizar un producto
const actualizarProductoModel = async (idProducto, nombreProducto, descProducto, precio) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL actualizarProducto(?, ?, ? , ?)", [idProducto, nombreProducto, descProducto, precio]);
        if(result.affectedRows === 0){
            throw new Error("No se actualizo el producto  en la bd");
        };
        return true;
    } catch (err) {
        console.error("Error en actualizarProductoModel: ", err.message);
        throw new Error("Error al actualizar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
}

// Modelo para obtener los datos de un producto por id 
const obtenerProductoPorIdModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [row] = await conexion.execute("CALL obtenerProductoPorId(?)", [idProducto]);
        
        return row[0];

    } catch (err) {
        console.error("Error en obtenerProductoPorIdModel: ", err.message);
        throw new Error("Error al obtener el producto de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para eliminar un producto
const eliminarProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL eliminarProducto(?)", [idProducto]);
        if(result.affectedRows === 0){
            throw new Error("No se pudo eliminar el producto  en la bd");
        };
        return true;

    } catch (err) {
        console.error("Error en eliminarProductoModel: ", err.message);
        throw new Error("Error al obtener el producto de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para actualizar una imagen de un producto
const actualizarImagenProductoModel = async (idProducto, nuevaUrl, nuevoPublicId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL actualizarImagenProducto(?, ?, ?)", [idProducto, nuevaUrl, nuevoPublicId]);
        if(result.affectedRows === 0){
            throw new Error("No se pudo actualizar la imagen en la bd");
        };
        return true;

    } catch (err) {
        console.error("Error en actualizarImagenProductoModel: ", err.message);
        throw new Error("Error al actualizar la imagen de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para obtener el public id de la imagen para eliminarlo de cloudinary
const obtenerPublicIdImagenModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [row] = await conexion.execute("CALL obtenerPublicIDPorProducto(?)", [idProducto]);

        return row[0][0].publicID;
    } catch (err) {
        console.error("Error en obtenerPublicIdImagenModel: ", err.message);
        throw new Error("Error al obtener public id de la imagen de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
}

module.exports = {
    insertarProductoModel,
    insertarCantidadInsumoProductoModel,
    validarProductoPorNombre,
    registrarImagenProductoModel,
    actualizarProductoModel,
    obtenerProductoPorIdModel,
    eliminarProductoModel,
    actualizarImagenProductoModel,
    obtenerPublicIdImagenModel
}