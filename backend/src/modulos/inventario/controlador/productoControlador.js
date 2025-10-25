const fs = require('fs');
const { insertarProductoService } = require("../servicio/productoServicio");

const insertarProductoController = async (req, res) => {
    try {
         const datos = JSON.parse(req.body.datos); // JSON del producto
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
}

module.exports = {
    insertarProductoController
}