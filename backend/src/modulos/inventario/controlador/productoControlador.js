const fs = require('fs');
const { insertarProductoService, actualizarProductoService, eliminarProductoService } = require("../servicio/productoServicio");

const insertarProductoController = async (req, res) => {
    try {
        if (!req.body.datos) {
            throw Object.assign(new Error("Se necesita los datos del producto."), { status: 400 });
        }

        // 🧠 Intentar convertir el JSON
        let datos;
        try {
            datos = JSON.parse(req.body.datos);
        } catch (parseError) {
            throw Object.assign(new Error("Formato incorrecto de los datos del producto."), { status: 400 });
        }
        const file = req.file;
        const respuesta = await insertarProductoService(datos, file);
        return res.status(200).json(respuesta);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en insertarProductoController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
        const statusCode = err.status || 500;
        fs.unlinkSync(req.file.path);
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

// Controlador para actualizar datos de un producto
const actualizarProductoController = async (req, res) => {
    try {
        const respuesta = await actualizarProductoService(req.params.idProducto, req.body);
        return res.status(200).json(respuesta);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en actualizarProductoController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

// Controlador para eliminar un producto
const eliminarProductoController = async (req, res) => {
    try {
        const respuesta = await eliminarProductoService(req.params.idProducto);
        return res.status(200).json(respuesta);
    } catch (err) {
        // Manejo centralizado de errores
        console.error("Error en eliminarProductoController:", err.message);

        // Determinar código de estado (usar 500 por defecto si no está especificado)
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
}

module.exports = {
    insertarProductoController,
    actualizarProductoController,
    eliminarProductoController
}