const { obtenerValoresEnum } = require('../../../helpers/inventario-helpers/inventarioHelper');
const {
    obtenerInsumoIDModel,
    obtenerStockActualModel,
} = require("..//modelo/inventarioModelo");

const validarDatosMovimiento = async (datos) => {
    const errores = [];

    // Sanitizar y validar tipo de movimiento
    if (!datos.tipoMovimiento || typeof datos.tipoMovimiento !== "string") {
        errores.push("El tipo de movimiento es obligatorio y debe ser un texto");
    } else {
        datos.tipoMovimiento = datos.tipoMovimiento.trim().toLowerCase();

        // Obtener valores desde la bd
        const tiposPermitidos = await obtenerValoresEnum("movimientosstock", "tipoMovimiento");
        if (!tiposPermitidos.includes(datos.tipoMovimiento)) {
            errores.push(`Tipo de movimiento inválido, solo se permite: ${tiposPermitidos.join(", ")}`);
        }
    }

    // Validar cantidad de movimiento
    if (datos.cantidadMovimiento === undefined || datos.cantidadMovimiento === null) {
        errores.push("La cantidad de movimiento es obligatoria");
    } else if (typeof datos.cantidadMovimiento !== 'number') {
        errores.push("La cantidad de movimiento debe ser un número");
    } else if (datos.cantidadMovimiento <= 0) {
        errores.push("La cantidad debe ser mayor a 0");
    }

    // Validar idInsumo
    if (!datos.idInsumo || isNaN(datos.idInsumo)) {
        errores.push("El ID de insumo es obligatorio y debe ser un número válido");
    } else {
        const insumo = await obtenerInsumoIDModel(datos.idInsumo);
        if (!insumo) {
            errores.push("El insumo especificado no existe");
        }
    }

    // Validar stock suficiente si es salida
    if (
        datos.tipoMovimiento === 'salida' &&
        datos.idInsumo &&
        typeof datos.cantidadMovimiento === 'number'
    ) {
        const stockActual = await obtenerStockActualModel(datos.idInsumo);
        if (datos.cantidadMovimiento > stockActual) {
            errores.push(`Stock insuficiente. Disponible: ${stockActual}`);
        }
    }

    return errores; //retornar los errores
};

module.exports={
    validarDatosMovimiento
}
