const { obtenerValoresEnum } = require('../../../helpers/inventario-helpers/inventarioHelper');
const {
    obtenerInsumoIDModel,
    obtenerStockActualModel,
} = require("..//modelo/insumoModelo");

const validarRegistrarMovimientoStock = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(
            new Error("Se necesitan los datos del movimiento para registrarlo."),
            { status: 400 }
        );
    }

    const { idInsumo, cantidadMovimiento, tipoMovimiento } = datos;

    // Validar ID del Insumo
    if (!idInsumo || typeof idInsumo !== "number") {
        throw Object.assign(
            new Error("Se necesita el id del insumo."),
            { status: 400 }
        );
    }

    // Validar cantidad
    if (!cantidadMovimiento || typeof cantidadMovimiento !== "number"){
        throw Object.assign(
            new Error("Se necesita la cantidad de movimiento."),
            { status: 400 }
        );
    }
    if(cantidadMovimiento <= 0){
        throw Object.assign(
            new Error("La cantidad de movimiento debe ser mayor a 0."),
            { status: 400 }
        );
    }

    if(!tipoMovimiento || typeof tipoMovimiento !== "string" || !tipoMovimiento.trim()){
        throw Object.assign(
            new Error("Se necesita el tipo de movimiento."),
            { status: 400 }
        );
    }
    // Validar tipo de movimiento
    const tiposPermitidos = ["entrada", "salida"];
    if (!tiposPermitidos.includes(tipoMovimiento)) {
        throw Object.assign(
            new Error("El tipo de movimiento debe ser 'entrada' o 'salida'."),
            { status: 400 }
        );
    }
};

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
    validarRegistrarMovimientoStock,
    validarDatosMovimiento
}
