const cloudinary = require("../../../config/cloudinaryConfig");
const fs = require('fs');
const {
    insertarProductoModel,
    insertarCantidadInsumoProductoModel,
    validarProductoPorNombreModel,
    registrarImagenProductoModel,
    actualizarProductoModel,
    obtenerProductoPorIdModel,
    eliminarProductoModel,
    actualizarImagenProductoModel,
    obtenerPublicIdImagenModel,
    actualizarCantidadUsoInsumoProductoModel,
    verificarRelacionProductoInsumoModel,
    eliminarCantidadInsumoProductoModel,
    actualizarUsaInsumosProductoModel,
    contarInsumosPorProductoModel,
    obtenerProductosModel,
    obtenerProductosPaginacionModel,
    buscarProductosPorNombreModel,
    obtenerInsumosPorProductoModel
} = require("../modelo/productoModelo");

const {
    validarInsertarProducto,
    validarActualizarProducto,
    validarActualizarCantidadesProducto,
    validarInsertarCantidadesProducto
} = require("../validaciones/productoValidaciones");


// 🟢 Insertar producto
const insertarProductoService = async (datos, file) => {
    await validarInsertarProducto(datos);

    const { nombreProducto, descripcionProducto, precio, usaInsumo, insumos } = datos;

    const existeProducto = await validarProductoPorNombreModel(nombreProducto);
    if (existeProducto.length > 0) {
        throw Object.assign(new Error("El producto ya existe"), { status: 400 });
    }

    const productoId = await insertarProductoModel(nombreProducto, descripcionProducto, precio, usaInsumo);
    if (!productoId) {
        throw Object.assign(new Error("Error al insertar producto"), { status: 500 });
    }

    // Si usa insumos, registrar cantidades
    if (usaInsumo === 1) {
        for (const insumo of insumos) {
            try {
                const mensaje = await insertarCantidadInsumoProductoModel(productoId, insumo.idInsumo, insumo.cantidadUso);
                if (!mensaje) {
                    throw Object.assign(new Error("No se pudo registrar la cantidad de insumos del producto"), { status: 500 });
                }
            } catch (err) {
                console.error("Error al registrar cantidad de insumo:", err.message);
                throw Object.assign(new Error("Error al registrar la cantidad de insumos del producto"), { status: 500 });
            }
        }
    }

    // Subir imagen a Cloudinary
    let cloudinaryResult;
    try {
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw Object.assign(new Error("No se pudo subir la imagen a Cloudinary"), { status: 500 });
    }

    const respuesta = await registrarImagenProductoModel(cloudinaryResult.secure_url, cloudinaryResult.public_id, productoId);
    if (!respuesta) {
        throw Object.assign(new Error("No se pudo insertar la imagen del producto"), { status: 500 });
    }

    fs.unlinkSync(file.path); // Eliminar archivo temporal

    return { ok: true, mensaje: "Producto insertado correctamente"};
};


// 🟢 Actualizar producto
const actualizarProductoService = async (idProducto, datos) => {
    validarActualizarProducto(Number(idProducto), datos);

    const { nombreProducto, descripcionProducto, precio } = datos;
    const producto = await obtenerProductoPorIdModel(idProducto);
    
    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    const existeProducto = await validarProductoPorNombreModel(nombreProducto);
    if (existeProducto.length > 0) {
        throw Object.assign(new Error("El nombre del producto ya está en uso"), { status: 400 });
    }

    const respuesta = await actualizarProductoModel(idProducto, nombreProducto, descripcionProducto, precio);
    if (!respuesta) {
        throw Object.assign(new Error("Error al actualizar producto"), { status: 500 });
    }

    return { ok: true, mensaje: respuesta };
};


// 🟢 Eliminar producto
const eliminarProductoService = async (idProducto) => {
    if (!idProducto) {
        throw Object.assign(new Error("Se necesita el ID del producto a eliminar"), { status: 400 });
    }

    const producto = await obtenerProductoPorIdModel(idProducto);
    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    const respuesta = await eliminarProductoModel(idProducto);
    if (!respuesta) {
        throw Object.assign(new Error("Error al eliminar producto"), { status: 500 });
    }

    return { ok: true, mensaje: respuesta };
};


// 🟢 Actualizar imagen de producto
const actualizarImagenProductoService = async (idProducto, file) => {
    if (!idProducto) {
        throw Object.assign(new Error("Se necesita el ID del producto para actualizar su imagen"), { status: 400 });
    }

    const producto = await obtenerProductoPorIdModel(idProducto);
    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    const publicID = await obtenerPublicIdImagenModel(idProducto);

    let cloudinaryResult;
    try {
        await cloudinary.uploader.destroy(publicID);
        cloudinaryResult = await cloudinary.uploader.upload(file.path, { folder: 'superpollo' });
    } catch (err) {
        throw Object.assign(new Error("Error al actualizar imagen en Cloudinary"), { status: 500 });
    }

    const respuesta = await actualizarImagenProductoModel(idProducto, cloudinaryResult.secure_url, cloudinaryResult.public_id);
    fs.unlinkSync(file.path);

    return { ok: true, mensaje: respuesta };
};


// 🟢 Actualizar cantidad de uso de insumos de un producto
const actualizarCantidadUsoInsumoProductoService = async (datos) => {
    validarActualizarCantidadesProducto(datos);

    const { idInsumo, idProducto, nuevaCantidad } = datos;
    const producto = await obtenerProductoPorIdModel(idProducto);

    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    if (producto[0].usaInsumos === 0) {
        throw Object.assign(new Error("El producto no usa insumos"), { status: 400 });
    }

    const contador = await verificarRelacionProductoInsumoModel(idProducto, idInsumo);
    if (contador === 0) {
        throw Object.assign(new Error("No existe relación entre el producto y el insumo"), { status: 404 });
    }

    const respuesta = await actualizarCantidadUsoInsumoProductoModel(idProducto, idInsumo, nuevaCantidad);
    if (!respuesta) {
        throw Object.assign(new Error("Error al actualizar la cantidad de uso"), { status: 500 });
    }

    return { ok: true, mensaje: respuesta };
};


// 🟢 Eliminar relación producto–insumo
const eliminarCantidadInsumoProductoService = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan tanto el ID del producto como del insumo"), { status: 400 });
    }

    const { idProducto, idInsumo } = datos;
    if (!idInsumo || typeof idInsumo !== "number") {
        throw Object.assign(new Error("Se necesita el ID del insumo"), { status: 400 });
    }
    if (!idProducto || typeof idProducto !== "number") {
        throw Object.assign(new Error("Se necesita el ID del producto"), { status: 400 });
    }

    const producto = await obtenerProductoPorIdModel(idProducto);
    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    if (producto[0].usaInsumos === 0) {
        throw Object.assign(new Error("El producto no usa insumos"), { status: 400 });
    }

    const contador = await verificarRelacionProductoInsumoModel(idProducto, idInsumo);
    if (contador === 0) {
        throw Object.assign(new Error("No existe relación entre el producto y el insumo"), { status: 404 });
    }

    const respuesta = await eliminarCantidadInsumoProductoModel(idProducto, idInsumo);
    if (!respuesta) {
        throw Object.assign(new Error("Error al eliminar la relación producto–insumo"), { status: 500 });
    }

    const cantidadInsumos = await contarInsumosPorProductoModel(idProducto);
    if (cantidadInsumos === 0) {
        const actualizar = await actualizarUsaInsumosProductoModel(idProducto, 0);
        if (!actualizar) {
            throw Object.assign(new Error("Error al actualizar el campo de uso de insumos del producto"), { status: 500 });
        }
    }

    return { ok: true, mensaje: respuesta };
};


// 🟢 Insertar nueva relación producto–insumo
const insertarCantidadInsumoProductoService = async (datos) => {
    validarInsertarCantidadesProducto(datos);

    const { idProducto, idInsumo, cantidadUso } = datos;

    const producto = await obtenerProductoPorIdModel(idProducto);
    if (producto.length === 0) {
        throw Object.assign(new Error("El producto especificado no existe"), { status: 404 });
    }

    if (producto[0].usaInsumos === 0) {
        const actualizar = await actualizarUsaInsumosProductoModel(idProducto, 1);
        if (!actualizar) {
            throw Object.assign(new Error("Error al actualizar el campo de uso de insumos del producto"), { status: 500 });
        }
    }

    const contador = await verificarRelacionProductoInsumoModel(idProducto, idInsumo);
    if (contador > 0) {
        throw Object.assign(new Error("Ya existe una relación entre el producto y el insumo"), { status: 400 });
    }

    const respuesta = await insertarCantidadInsumoProductoModel(idProducto, idInsumo, cantidadUso);
    if (!respuesta) {
        throw Object.assign(new Error("No se pudo insertar la cantidad de insumos del producto"), { status: 500 });
    }

    return { ok: true, mensaje: respuesta };
};

//Servicio para obtener productos por paginacion
const obtenerProductosService = async () => {

    const productos = await obtenerProductosModel();
    if (!productos || productos.length === 0) {
        throw Object.assign(
            new Error("No existen productos registrados."),
            { status: 404 }
        );
    }

    return {
        ok: true, 
        productos: productos
    };
};

//Servicio para obtener productos por paginacion
const obtenerProductosPaginacionService = async (limit, offset) => {
    // Asignar valores por defecto si no se envían
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const productos = await obtenerProductosPaginacionModel(limite, desplazamiento);
    if (!productos || productos.length === 0) {
        throw Object.assign(
            new Error("No existen productos registrados."),
            { status: 404 }
        );
    }

    return {
        ok: true, 
        productos: productos
    };
};

//Servicio para obtener datos de un producto por id
const obtenerProductoPorIdService = async (idProducto) => {
    if (!idProducto || isNaN(Number(idProducto))) {
        throw Object.assign(
            new Error("Se requiere un ID de producto válido."),
            { status: 400 }
        );
    }

    const producto = await obtenerProductoPorIdModel(Number(idProducto));

    if (!producto || producto.length === 0) {
        throw Object.assign(new Error("No existe un producto con el ID especificado."), { status: 404 });
    }

    return {
        ok: true, 
        producto: producto[0]
    };
};

// Servicio para buscar un producto
const buscarProductosPorNombreService = async (nombre) => {
    if (!nombre || typeof nombre !== "string") {
        throw Object.assign(new Error("Se necesita un nombre válido para buscar productos."), { status: 400 });
    }

    const productos = await buscarProductosPorNombreModel(nombre);

    if (!productos || productos.length === 0) {
        throw Object.assign(new Error("No existen productos que coincidan con la búsqueda."), { status: 404 });
    }

    return {
        ok: true, 
        productos: productos
    };
};

// Servicio para obtener los insumos y su cantidad de un producto
const obtenerInsumosPorProductoService = async (idProducto) => {
    if (!idProducto) {
        throw Object.assign(new Error("Se necesita el ID del producto."), { status: 400 });
    }

    const producto = await obtenerProductoPorIdModel(idProducto);

    if (!producto || producto.length === 0) {
        throw Object.assign(new Error("No existe un producto con el ID especificado."), { status: 404 });
    }

    const insumos = await obtenerInsumosPorProductoModel(idProducto);

    if (!insumos || insumos.length === 0) {
        throw Object.assign(new Error("No existen insumos asociados a este producto."), { status: 404 });
    }

    return {
        ok: true, 
        insumos: insumos
    };
};


module.exports = {
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
    obtenerInsumosPorProductoService
};
