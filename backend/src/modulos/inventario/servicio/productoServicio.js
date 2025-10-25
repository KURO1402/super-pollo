const cloudinary = require("../../../config/cloudinaryConfig");
const fs = require('fs');
const { insertarProductoModel, insertarCantidadInsumoProductoModel, validarProductoPorNombre, registrarImagenProductoModel } = require("../modelo/productoModelo");
const { validarInsertarProduto } = require("../validaciones/productoValidaciones");

const insertarProductoService = async (datos, file) => {
    await validarInsertarProduto(datos);
    const { nombreProducto, descripcionProducto, precio, usaInsumo, insumos } = datos;
    const existeProducto = await validarProductoPorNombre(nombreProducto);
    if (existeProducto.length > 0) {
        throw Object.assign(new Error("El producto ya existe"), { status: 400 });
    }
    // Subir la imagen a Cloudinary usando el archivo pasado
    const result = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });

    const imagenId = await registrarImagenProductoModel(result.secure_url, result.public_id);

    // Eliminar archivo temporal del servidor
    fs.unlinkSync(file.path);

    const respuesta = await insertarProductoModel(nombreProducto, descripcionProducto, precio, usaInsumo, imagenId);

    if (usaInsumo === 1) {
        for (const insumo of insumos) {
            try {
                const mensaje = await insertarCantidadInsumoProductoModel(respuesta.idGenerado, insumo.idInsumo, insumo.cantidadUso);
                if (!mensaje) {
                    throw Object.assign(new Error("No se pudo registra la cantidad de insumos de un producto"), { status: 500 });
                }
            } catch (err) {
                console.error("Error al registrar cantida de insumo:", err.message);
                throw Object.assign(new Error("Error al registrar la cantidad de insumos del producto"), { status: 500 });
            }
        }
    };

    return {
        ok: true,
        mensaje: respuesta.mensaje
    }
};

module.exports = {
    insertarProductoService
}