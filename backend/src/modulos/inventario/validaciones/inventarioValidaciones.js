const { obtenerValoresEnum } = require('../../../helpers/inventario-helpers/inventarioHelper');

const esSoloNumeros = (texto) => /^[0-9]+$/.test(texto);

const validarDatosInsumo = async (datos) => {
    const errores = [];

    // nombreInsumo
    if (!datos.nombreInsumo || typeof datos.nombreInsumo !== 'string' || datos.nombreInsumo.trim() === '') {
        errores.push("El nombre del insumo es obligatorio y debe ser un texto válido");
    } else {
        datos.nombreInsumo = datos.nombreInsumo.trim();
        if (esSoloNumeros(datos.nombreInsumo)) {
            errores.push("El nombre del insumo no puede ser solo un número");
        }
        if (datos.nombreInsumo.length > 100) {
            errores.push("El nombre del insumo excede los 100 caracteres");
        }
    }

    // unidadMedida
    if (!datos.unidadMedida || typeof datos.unidadMedida !== 'string' || datos.unidadMedida.trim() === '') {
        errores.push("La unidad de medida es obligatoria y debe ser un texto válido");
    } else {
        datos.unidadMedida = datos.unidadMedida.trim();
        if (esSoloNumeros(datos.unidadMedida)) {
            errores.push("La unidad de medida no puede ser solo un número");
        }
        if (datos.unidadMedida.length > 20) {
            errores.push("La unidad de medida excede los 20 caracteres");
        }
    }

    // stockInsumo
    if (datos.stockInsumo === undefined) {
        datos.stockInsumo = 0;
    } else if (typeof datos.stockInsumo !== 'number' || datos.stockInsumo < 0) {
        errores.push("El stock debe ser un número mayor o igual a cero");
    }

    // categoriaProducto
    if (!datos.categoriaProducto || typeof datos.categoriaProducto !== 'string') {
        errores.push("La categoría del producto es obligatoria y debe ser un texto");
    } else {
        datos.categoriaProducto = datos.categoriaProducto.trim();
        const categoriasValidas = await obtenerValoresEnum("insumos", "categoriaProducto");

        if (!categoriasValidas.includes(datos.categoriaProducto)) {
            errores.push(`Categoría inválida. Las permitidas son: ${categoriasValidas.join(", ")}`);
        }
    }

    // Si hay errores, lanza uno solo
    if (errores.length > 0) {
        const error = new Error(errores.join(" | "));
        error.status = 400;
        throw error;
    }

    return datos;
};

module.exports = {
    validarDatosInsumo
};
