const fs = require("fs");
const {
    insertarProductoService,
    actualizarProductoService,
    eliminarProductoService,
    actualizarImagenProductoService,
    actualizarCantidadUsoInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    insertarCantidadInsumoProductoService
} = require("../servicio/productoServicio");

// ✅ Insertar un nuevo producto
const insertarProductoController = async (req, res) => {
    try {
        if (!req.body.datos) {
            throw Object.assign(new Error("Se necesitan los datos del producto."), { status: 400 });
        }

        // Intentar convertir el JSON recibido
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

        // Eliminar archivo solo si existe
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Actualizar datos del producto
const actualizarProductoController = async (req, res) => {
    try {
        const respuesta = await actualizarProductoService(req.params.idProducto, req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarProductoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Eliminar un producto
const eliminarProductoController = async (req, res) => {
    try {
        const respuesta = await eliminarProductoService(req.params.idProducto);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en eliminarProductoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Actualizar imagen de producto
const actualizarImagenProductoController = async (req, res) => {
    try {
        const file = req.file;
        const respuesta = await actualizarImagenProductoService(req.params.idProducto, file);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarImagenProductoController:", err.message);
        const statusCode = err.status || 500;

        // Eliminar archivo solo si existe
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Actualizar cantidad de uso de un insumo en producto
const actualizarCantidadUsoInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await actualizarCantidadUsoInsumoProductoService(req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en actualizarCantidadUsoInsumoProductoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Eliminar un insumo asociado a un producto
const eliminarCantidadInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await eliminarCantidadInsumoProductoService(req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        console.error("Error en eliminarCantidadInsumoProductoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// ✅ Insertar cantidad de insumo a un producto
const insertarCantidadInsumoProductoController = async (req, res) => {
    try {
        const respuesta = await insertarCantidadInsumoProductoService(req.body);
        return res.status(201).json(respuesta);
    } catch (err) {
        console.error("Error en insertarCantidadInsumoProductoController:", err.message);
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
    insertarCantidadInsumoProductoController
};
