const cloudinary = require("../../../config/cloudinaryConfig");
const fs = require('fs');
const { insertarProductoModel, insertarCantidadInsumoProductoModel, validarProductoPorNombre, registrarImagenProductoModel, actualizarProductoModel, obtenerProductoPorIdModel, eliminarProductoModel } = require("../modelo/productoModelo");
const { validarInsertarProduto, validarActualizarProducto } = require("../validaciones/productoValidaciones");

const insertarProductoService = async (datos, file) => {
    
    await validarInsertarProduto(datos);

    const { nombreProducto, descripcionProducto, precio, usaInsumo, insumos } = datos;

    const existeProducto = await validarProductoPorNombre(nombreProducto);
    if (existeProducto.length > 0) {
        throw Object.assign(new Error("El producto ya existe"), { status: 400 });
    }

    const productoId = await insertarProductoModel(nombreProducto, descripcionProducto, precio, usaInsumo);

    if (usaInsumo === 1) {
        for (const insumo of insumos) {
            try {
                const mensaje = await insertarCantidadInsumoProductoModel( productoId, insumo.idInsumo, insumo.cantidadUso);
                if (!mensaje) {
                    throw Object.assign(new Error("No se pudo registra la cantidad de insumos de un producto"), { status: 500 });
                }
            } catch (err) {
                console.error("Error al registrar cantida de insumo:", err.message);
                throw Object.assign(new Error("Error al registrar la cantidad de insumos del producto"), { status: 500 });
            }
        }
    };
    // Subir la imagen a Cloudinary usando el archivo pasado
    let result
    try {
        result = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw Object.assign(new Error("No se pudo subir la imagen a cloudinary"), { status: 500 });
    }
    const respuesta = await registrarImagenProductoModel(result.secure_url, result.public_id, productoId);
    if(!respuesta){
        throw Object.assign(new Error("No se pudo insertar la imagen del producto"), { status: 500 });
    }
    
    // Eliminar archivo temporal del servidor
    fs.unlinkSync(file.path);
    return {
        ok: true,
        mensaje: "Producto agregado exitosamente"
    }
};

// Servicio para actualizar datos de un producto
const actualizarProductoService = async (idProducto, datos) => {
    validarActualizarProducto(idProducto, datos);
    const { nombreProducto, descripcionProducto, precio } = datos;
    const producto = await obtenerProductoPorIdModel(idProducto);
    if(producto.length === 0){
        throw Object.assign(new Error("El producto especificado no existe"), { status: 400 });
    };
    const existeProducto = await validarProductoPorNombre(nombreProducto);
    if (existeProducto.length > 0) {
        throw Object.assign(new Error("El nombre de producto ya esta en uso"), { status: 400 });
    };
    const respuesta = await actualizarProductoModel(idProducto, nombreProducto, descripcionProducto, precio);
    if(!respuesta){
        throw Object.assign(new Error("Error al actualizar producto"), { status: 500 });
    }
    return {
        ok: true,
        mensaje: "Producto actualizado correctamente"
    }
};
 
// Servicio para eliminar un producto
const eliminarProductoService = async (idProducto) => {
    if(!idProducto){
        throw Object.assign(new Error("Se necesita el id del produccto a eliminar"), { status: 400 });
    };
    const producto = await obtenerProductoPorIdModel(idProducto);
    if(producto.length === 0){
        throw Object.assign(new Error("El producto especificado no existe"), { status: 400 });
    };
    const respuesta = await eliminarProductoModel(idProducto);
    if(!respuesta){
        throw Object.assign(new Error("Error al actualizar producto"), { status: 500 });
    }
    return {
        ok: true,
        mensaje: "Producto eliminado correctamente"
    }
}

module.exports = {
    insertarProductoService,
    actualizarProductoService,
    eliminarProductoService
}