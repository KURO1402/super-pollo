const fs = require("fs");
const {
    insertarProductoService,
    actualizarProductoService,
    eliminarProductoService,
    actualizarImagenProductoService,
    actualizarCantidadUsoInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    insertarCantidadInsumoProductoService,
    obtenerProductosService,
    obtenerProductosPaginacionService,
    obtenerProductoPorIdService,
    buscarProductosPorNombreService,
    obtenerProductosPorCategoriaService,
    obtenerInsumosPorProductoService,
    insertarCategoriaProductoService,
    actualizarCategoriaProductoService,
    obtenerCategoriaPorIdService,
    obtenerCategoriasProductoService
} = require("../servicio/productoServicio");

const insertarProductoController = async (req, res) => {
    try {
        if (!req.body.datos) {
            throw Object.assign(new Error("Se necesitan los datos del producto."), { status: 400 });
        }

        let datos;
        try {
            datos = JSON.parse(req.body.datos);
        } catch (parseError) {
            throw Object.assign(new Error("Formato incorrecto de los datos del producto."), { status: 400 });
        }

        const file = req.file;
        const respuesta = await insertarProductoService(datos, file);
        return res.status(201).json(respuesta);

    } catch (err) {
        console.error("Error en insertarProductoController:", err.message);
        const statusCode = err.status || 500;

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarProductoController = async (req, res) => {
    try {
        const respuesta = await actualizarProductoService(req.params.idProducto, req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarProductoController = async (req, res) => {
    try {
        const respuesta = await eliminarProductoService(req.params.idProducto);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarImagenProductoController = async (req, res) => {
    try {
        const file = req.file;
        const respuesta = await actualizarImagenProductoService(req.params.idProducto, file);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarCantidadUsoInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await actualizarCantidadUsoInsumoProductoService(req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarCantidadInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await eliminarCantidadInsumoProductoService(req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const insertarCantidadInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await insertarCantidadInsumoProductoService(req.body);
        return res.status(201).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerProductosController = async (req, res) => {
    try {

        const resultado = await obtenerProductosService();

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerProductosPaginacionController = async (req, res) => {
    try {
        const { limit, offset } = req.query; 

        const resultado = await obtenerProductosPaginacionService(limit, offset);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerProductoPorIdController = async (req, res) => {
    try {
        const { idProducto } = req.params;
        const resultado = await obtenerProductoPorIdService(idProducto);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const buscarProductosPorNombreController = async (req, res) => {
    try {
        const { nombre } = req.query; 
        const resultado = await buscarProductosPorNombreService(nombre);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerProductosPorCategoriaController = async (req, res) => {
    try {
        const { idCategoria } = req.params;
        const resultado = await obtenerProductosPorCategoriaService(idCategoria);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

//
const obtenerInsumosPorProductoControlller = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await obtenerInsumosPorProductoService(idProducto);

        res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const insertarCategoriaProductoController = async (req, res) => {
    try {
        const respuesta = await insertarCategoriaProductoService(req.body);

        return res.status(201).json(respuesta); 
    } catch (err) {

        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarCategoriaProductoController = async (req, res) => {
    try {
        const { idCategoria } = req.params;

        const respuesta = await actualizarCategoriaProductoService(idCategoria, req.body);

        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerCategoriaPorIdController = async (req, res) => {
    try {
        const { idCategoria } = req.params;
        const resultado = await obtenerCategoriaPorIdService(idCategoria);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerCategoriasProductoController = async (req, res) => {
    try {
        const resultado = await obtenerCategoriasProductoService();

        res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

module.exports = {
    insertarProductoController,
    actualizarProductoController,
    eliminarProductoController,
    actualizarImagenProductoController,
    actualizarCantidadUsoInsumoProductoController,
    eliminarCantidadInsumoProductoController,
    insertarCantidadInsumoProductoController,
    obtenerProductosController,
    obtenerProductosPaginacionController,
    obtenerProductoPorIdController,
    buscarProductosPorNombreController,
    obtenerProductosPorCategoriaController,
    obtenerInsumosPorProductoControlller,
    insertarCategoriaProductoController,
    actualizarCategoriaProductoController,
    obtenerCategoriaPorIdController,
    obtenerCategoriasProductoController
};
