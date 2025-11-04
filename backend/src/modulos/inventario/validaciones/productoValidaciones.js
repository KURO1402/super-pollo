const { obtenerInsumoIDModel } = require("../../inventario/modelo/insumoModelo");

const validarInsertarProducto = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan los datos del producto para registrarlo"), { status: 400 });
    }

    const { nombreProducto, descripcionProducto, precio, usaInsumo, insumos, idCategoria } = datos;

    if (!nombreProducto || typeof nombreProducto !== "string" || !nombreProducto.trim()) {
        throw Object.assign(new Error("El nombre del producto es obligatorio y debe ser texto"), { status: 400 });
    }

    if (!descripcionProducto || typeof descripcionProducto !== "string" || !descripcionProducto.trim()) {
        throw Object.assign(new Error("La descripción del producto es obligatoria y debe ser texto"), { status: 400 });
    }

    if (typeof precio !== "number" || isNaN(precio)) {
        throw Object.assign(new Error("El precio del producto debe ser un número válido"), { status: 400 });
    }
    if (precio <= 0) {
        throw Object.assign(new Error("El precio del producto debe ser mayor a 0"), { status: 422 });
    }

    if (usaInsumo === null || usaInsumo === undefined || typeof usaInsumo !== "number") {
        throw Object.assign(new Error("Debe especificarse si el producto usa insumos"), { status: 400 });
    }
    if (![0, 1].includes(usaInsumo)) {
        throw Object.assign(new Error("El campo usaInsumo debe ser 0 (no usa) o 1 (usa)"), { status: 422 });
    }

    if (!Array.isArray(insumos)) {
        throw Object.assign(new Error("El campo insumos debe ser un arreglo"), { status: 400 });
    }
    if (usaInsumo === 1 && insumos.length === 0) {
        throw Object.assign(new Error("Debe especificar al menos un insumo y su cantidad"), { status: 422 });
    }

    if(!idCategoria || typeof idCategoria !== "number"){
        throw Object.assign(new Error("Se necesita la categoria del producto."), { status: 400 });
    }

    const erroresInsumos = [];

    for (const insumo of insumos) {
        if (typeof insumo !== 'object' || insumo === null) {
            throw Object.assign(new Error("Cada insumo debe ser un objeto con ID y cantidad"), { status: 400 });
        }

        const { idInsumo, cantidadUso } = insumo;

        if (typeof idInsumo !== "number" || typeof cantidadUso !== "number") {
            throw Object.assign(new Error("El idInsumo y la cantidadUso deben ser numéricos"), { status: 400 });
        }

        if (cantidadUso <= 0) {
            throw Object.assign(new Error("La cantidad de uso debe ser mayor a 0"), { status: 422 });
        }

        try {
            const insumoExistente = await obtenerInsumoIDModel(idInsumo);
            if (!insumoExistente) {
                erroresInsumos.push(`El insumo con ID ${idInsumo} no existe`);
            }
        } catch (err) {
            erroresInsumos.push(`Error al validar el insumo con ID ${idInsumo}: ${err.message}`);
        }
    }

    if (erroresInsumos.length > 0) {
        throw Object.assign(new Error("Uno o más insumos no existen o son inválidos"), { status: 404 });
    }
};


const validarActualizarProducto = (datos) => {

    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan los datos del producto a actualizar"), { status: 400 });
    }

    const { nombreProducto, descripcionProducto, precio, idCategoria } = datos;

    if (!nombreProducto || typeof nombreProducto !== "string" || !nombreProducto.trim()) {
        throw Object.assign(new Error("El nombre del producto es obligatorio y debe ser texto"), { status: 400 });
    }

    if (!descripcionProducto || typeof descripcionProducto !== "string" || !descripcionProducto.trim()) {
        throw Object.assign(new Error("La descripción del producto es obligatoria y debe ser texto"), { status: 400 });
    }

    if (typeof precio !== "number" || isNaN(precio)) {
        throw Object.assign(new Error("El precio del producto debe ser un número válido"), { status: 400 });
    }
    if (precio <= 0) {
        throw Object.assign(new Error("El precio debe ser mayor a 0"), { status: 422 });
    }

    if(!idCategoria || typeof idCategoria !== "number"){
        throw Object.assign(new Error("Se necesita la categoria del producto."), { status: 400 });
    }
};


const validarActualizarCantidadesProducto = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan el ID del producto, el ID del insumo y la nueva cantidad"), { status: 400 });
    }

    const { idInsumo, idProducto, nuevaCantidad } = datos;

    if (!idInsumo || typeof idInsumo !== "number") {
        throw Object.assign(new Error("El ID del insumo es obligatorio y debe ser numérico"), { status: 400 });
    }

    if (!idProducto || typeof idProducto !== "number") {
        throw Object.assign(new Error("El ID del producto es obligatorio y debe ser numérico"), { status: 400 });
    }

    if (typeof nuevaCantidad !== "number" || isNaN(nuevaCantidad)) {
        throw Object.assign(new Error("La nueva cantidad de uso debe ser un número válido"), { status: 400 });
    }

    if (nuevaCantidad <= 0) {
        throw Object.assign(new Error("La nueva cantidad de uso debe ser mayor a 0"), { status: 422 });
    }
};


const validarInsertarCantidadesProducto = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan el ID del producto, el ID del insumo y la cantidad de uso"), { status: 400 });
    }

    const { idInsumo, idProducto, cantidadUso } = datos;

    if (!idInsumo || typeof idInsumo !== "number") {
        throw Object.assign(new Error("El ID del insumo es obligatorio y debe ser numérico"), { status: 400 });
    }

    if (!idProducto || typeof idProducto !== "number") {
        throw Object.assign(new Error("El ID del producto es obligatorio y debe ser numérico"), { status: 400 });
    }

    if (typeof cantidadUso !== "number" || isNaN(cantidadUso)) {
        throw Object.assign(new Error("La cantidad de uso debe ser un número válido"), { status: 400 });
    }

    if (cantidadUso <= 0) {
        throw Object.assign(new Error("La cantidad de uso debe ser mayor a 0"), { status: 422 });
    }
};


module.exports = {
    validarInsertarProducto,
    validarActualizarProducto,
    validarActualizarCantidadesProducto,
    validarInsertarCantidadesProducto
};
