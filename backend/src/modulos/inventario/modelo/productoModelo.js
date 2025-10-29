
const pool = require("../../../config/conexionDB");

// PROCEDIMIENTOS QUE DEVUELVEN DATOS (SELECT)

// Obtener producto por ID
const obtenerProductoPorIdModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL obtenerProductoPorId(?)", [idProducto]);
        return rows[0];
    } catch (err) {
        console.error("Error en obtenerProductoPorIdModel:", err.message);
        throw new Error("Error al obtener el producto de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Validar producto por nombre
const validarProductoPorNombreModel = async (nombreProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL validarProductoPorNombre(?)", [nombreProducto]);
        return rows[0];
    } catch (err) {
        console.error("Error en validarProductoPorNombreModel:", err.message);
        throw new Error("Error al validar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Verificar relación producto-insumo
const verificarRelacionProductoInsumoModel = async (idProducto, idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL verificarRelacionProductoInsumo(?, ?)", [idProducto, idInsumo]);
        return rows[0][0].contador;
    } catch (err) {
        console.error("Error en verificarRelacionProductoInsumoModel:", err.message);
        throw new Error("Error al verificar la relación entre producto e insumo en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Contar insumos por producto
const contarInsumosPorProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL contarInsumosPorProducto(?)", [idProducto]);
        return rows[0][0]?.totalInsumos;
    } catch (err) {
        console.error("Error en contarInsumosPorProductoModel:", err.message);
        throw new Error("Error al contar los insumos del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Obtener PublicID por producto
const obtenerPublicIdImagenModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute("CALL obtenerPublicIDPorProducto(?)", [idProducto]);
        return rows[0][0].publicID;
    } catch (err) {
        console.error("Error en obtenerPublicIdImagenModel:", err.message);
        throw new Error("Error al obtener public id de la imagen de la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// =============================================
// 🔸 PROCEDIMIENTOS QUE MODIFICAN DATOS (INSERT / UPDATE / DELETE)
// =============================================

// Registrar producto
const insertarProductoModel = async (nombreProducto, descProducto, precio, usaInsumo, idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL registrarProducto(?, ?, ?, ?, ?)",
            [nombreProducto, descProducto, precio, usaInsumo, idCategoria]
        );
        return result[0][0]?.idGenerado; // { idGenerado }
    } catch (err) {
        console.error("Error en insertarProductoModel:", err.message);
        throw new Error("Error al registrar producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Registrar imagen del producto
const registrarImagenProductoModel = async (urlImagen, publicId, idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL registrarImagenProducto(?, ?, ?)",
            [urlImagen, publicId, idProducto]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en registrarImagenProductoModel:", err.message);
        throw new Error("Error al registrar la imagen del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Registrar cantidad de insumo por producto
const insertarCantidadInsumoProductoModel = async (idProducto, idInsumo, cantidad) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL registrarCantidadInsumoProducto(?, ?, ?)",
            [idProducto, idInsumo, cantidad]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en insertarCantidadInsumoProductoModel:", err.message);
        throw new Error("Error al registrar cantidad de insumo del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Actualizar producto
const actualizarProductoModel = async (idProducto, nombreProducto, descProducto, precio, idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL actualizarProducto(?, ?, ?, ?, ?)",
            [idProducto, nombreProducto, descProducto, precio, idCategoria]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en actualizarProductoModel:", err.message);
        throw new Error("Error al actualizar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Actualizar imagen de producto
const actualizarImagenProductoModel = async (idProducto, nuevaUrl, nuevoPublicId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL actualizarImagenProducto(?, ?, ?)",
            [idProducto, nuevaUrl, nuevoPublicId]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en actualizarImagenProductoModel:", err.message);
        throw new Error("Error al actualizar la imagen del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Actualizar cantidad de uso de insumo en producto
const actualizarCantidadUsoInsumoProductoModel = async (idProducto, idInsumo, nuevaCantidad) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL actualizarCantidadUsoInsumoProducto(?, ?, ?)",
            [idProducto, idInsumo, nuevaCantidad]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en actualizarCantidadUsoInsumoProductoModel:", err.message);
        throw new Error("Error al actualizar la cantidad de uso del insumo en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Actualizar campo usaInsumos
const actualizarUsaInsumosProductoModel = async (idProducto, usaInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL actualizarUsaInsumosProducto(?, ?)",
            [idProducto, usaInsumo]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en actualizarUsaInsumosProductoModel:", err.message);
        throw new Error("Error al actualizar el campo usaInsumos del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Eliminar relación producto-insumo
const eliminarCantidadInsumoProductoModel = async (idProducto, idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL eliminarCantidadInsumoProducto(?, ?)",
            [idProducto, idInsumo]
        );
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en eliminarCantidadInsumoProductoModel:", err.message);
        throw new Error("Error al eliminar la relación producto-insumo en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

//  Eliminar producto
const eliminarProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL eliminarProducto(?)", [idProducto]);
        return result[0][0].mensaje;
    } catch (err) {
        console.error("Error en eliminarProductoModel:", err.message);
        throw new Error("Error al eliminar el producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para obtener todos los productos
const obtenerProductosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerProductos()");
        return result[0];
    } catch (err) {
        console.error("Error en obtenerProductosModel:", err.message);
        throw Object.assign(
            new Error("Error al obtener los productos de la base de datos"),
            { status: 500 }
        );
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para obtener productos por paginacion
const obtenerProductosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerProductosPaginacion(?, ?)", [limit, offset]);
        return result[0];
    } catch (err) {
        console.error("Error en obtenerProductosPaginacionModel:", err.message);
        throw Object.assign(
            new Error("Error al obtener los productos de la base de datos"),
            { status: 500 }
        );
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para buscar un producto por nombre
const buscarProductosPorNombreModel = async (nombre) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL buscarProductosPorNombre(?)", [nombre]);
        // Devuelve todos los productos que coincidan con el nombre
        return result[0];
    } catch (err) {
        console.error("Error en buscarProductosPorNombreModel:", err.message);
        throw new Error("Error al buscar productos por nombre en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerProductosPorCategoriaModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerProductosPorCategoria(?)", [idCategoria]);
        return result[0]; // Devuelve los productos encontrados
    } catch (err) {
        console.error("Error en obtenerProductosPorCategoriaModel:", err.message);
        throw new Error("Error al obtener productos por categoría en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

// Modelo para obtener los insumos y su cantidad de un producto
const obtenerInsumosPorProductoModel = async (idProducto) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerInsumosPorProducto(?)", [idProducto]);
        return result[0]; // Devuelve el array de insumos con su cantidad
    } catch (err) {
        console.error("Error en obtenerInsumosPorProductoModel:", err.message);
        throw new Error("Error al obtener los insumos del producto en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelos para categorias
const insertarCategoriaProductoModel = async (nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL insertarCategoriaProducto(?)",
            [nombreCategoria]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        console.error("Error en insertarCategoriaProductoModel:", err.message);
        throw new Error("Error al registrar categoría en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarCategoriaProductoModel = async (idCategoria, nombreCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            "CALL actualizarCategoriaProducto(?, ?)",
            [idCategoria, nombreCategoria]
        );

        return result?.[0]?.[0]?.mensaje; // "Categoría actualizada correctamente."
    } catch (err) {
        console.error("Error en actualizarCategoriaProductoModel:", err.message);
        throw err;
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCategoriaPorNombreModel = async (nombre) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerCategoriaPorNombre(?)", [nombre]);
        return result[0]; // Devuelve la categoría encontrada
    } catch (err) {
        console.error("Error en obtenerCategoriaPorNombreModel:", err.message);
        throw new Error("Error al obtener categoría por nombre en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCategoriaPorIdModel = async (idCategoria) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL obtenerCategoriaPorId(?)", [idCategoria]);
        return result[0]; // Devuelve la categoría encontrada
    } catch (err) {
        console.error("Error en obtenerCategoriaPorIdModel:", err.message);
        throw new Error("Error al obtener categoría por ID en la base de datos");
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCategoriasProductoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL ObtenerCategoriasProducto()");
        return result[0]; // El resultado de las categorías estará en el primer elemento
    } catch (err) {
        console.error("Error en obtenerCategoriasModel:", err.message);
        throw Object.assign(
            new Error("Error al obtener las categorías de la base de datos"),
            { status: 500 }
        );
    } finally {
        if (conexion) conexion.release(); // Liberamos la conexión
    }
};

// EXPORTAR MODELOS
module.exports = {
    obtenerProductoPorIdModel,
    validarProductoPorNombreModel,
    verificarRelacionProductoInsumoModel,
    contarInsumosPorProductoModel,
    obtenerPublicIdImagenModel,
    insertarProductoModel,
    registrarImagenProductoModel,
    insertarCantidadInsumoProductoModel,
    actualizarProductoModel,
    actualizarImagenProductoModel,
    actualizarCantidadUsoInsumoProductoModel,
    actualizarUsaInsumosProductoModel,
    eliminarCantidadInsumoProductoModel,
    eliminarProductoModel,
    obtenerProductosModel,
    obtenerProductosPaginacionModel,
    buscarProductosPorNombreModel,
    obtenerProductosPorCategoriaModel,
    obtenerInsumosPorProductoModel,
    insertarCategoriaProductoModel,
    actualizarCategoriaProductoModel,
    obtenerCategoriaPorNombreModel,
    obtenerCategoriaPorIdModel,
    obtenerCategoriasProductoModel 
};
