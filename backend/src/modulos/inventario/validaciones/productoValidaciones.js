const { obtenerInsumoIDModel } = require("../../inventario/modelo/inventarioModelo");

const validarInsertarProduto = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan datos del producto para poder registrar un nuevo producto"), { status: 400 });
    };
    const { nombreProducto, descripcionProducto, precio, usaInsumo, insumos } = datos;

    // Validación para nombreProducto
    if (!nombreProducto || typeof nombreProducto !== "string" || nombreProducto.trim().length === 0) {
        throw Object.assign(new Error("Se necesita el nombre del producto"), { status: 400 });
    }

    // Validación para descripcionProducto (opcional pero si viene debe ser string)
    if (!descripcionProducto || typeof descripcionProducto !== "string" || descripcionProducto.trim().length === 0) {
        throw Object.assign(new Error("Se necesita una descripcion del producto"), { status: 400 });
    }

    // Validación para precio
    if (!precio || typeof precio !== "number") {
        throw Object.assign(new Error("Se necesita el precio del producto"), { status: 400 });
    }

    if (precio <= 0) {
        throw Object.assign(new Error("El precio debe ser mayor a 0"), { status: 400 });
    }

    // Validación para usaInsumo
    if (usaInsumo === null || usaInsumo === undefined || typeof usaInsumo !== "number") {
        throw Object.assign(new Error("Se necesita especificar si el producto usa insumos"), { status: 400 });
    }

    // Si es número, validar que sea 0 o 1
    if (usaInsumo !== 0 && usaInsumo !== 1) {
        throw Object.assign(new Error("El campo usaInsumo debe ser 0 (false) o 1 (true)"), { status: 400 });
    }

    //Validar que insumos sea una array
    if (!Array.isArray(insumos)) {
        throw Object.assign(new Error("Los insumos deben ser un array"), { status: 400 });
    }

    //Si usa insumos entoces debe contener datos el array de insumos
    if (usaInsumo === 1 && insumos.length === 0) {
        throw Object.assign(new Error("Especifique insumos y su cantidad"), { status: 400 });
    };

    // ✅ SOLUCIÓN: Validar existencia de insumos en BD
    const erroresInsumos = [];
    
    for (const insumo of insumos) {
        // Validar estructura del insumo
        if (typeof insumo !== 'object' || insumo === null) {
            erroresInsumos.push("Todos los insumos deben ser objetos");
            continue;
        }

        if (!insumo.idInsumo || insumo.cantidadUso === null || insumo.cantidadUso === undefined || typeof insumo.idInsumo !== "number" || typeof insumo.cantidadUso !== "number") {
            erroresInsumos.push("Cada insumo debe tener idInsumo y cantidadUso como números");
            continue;
        }

        if (insumo.cantidadUso <= 0) {
            erroresInsumos.push("La cantidad tiene que ser un número mayor a 0");
            continue;
        }

        // Validar existencia en base de datos
        try {
            const insumoExistente = await obtenerInsumoIDModel(insumo.idInsumo);
            
            if (!insumoExistente) {
                erroresInsumos.push(`El insumo con ID ${insumo.idInsumo} no existe`);
            }
            
        } catch (err) {
            erroresInsumos.push(`Error al validar insumo ID ${insumo.idInsumo}: ${err.message}`);
        }
    };

    // ✅ IMPORTANTE: Lanzar error si hay problemas con los insumos
    if (erroresInsumos.length > 0) {
        throw Object.assign(new Error("No existe uno o mas de los insumos ingresados"), { status: 400 });
    }
};


module.exports = {
    validarInsertarProduto
}
