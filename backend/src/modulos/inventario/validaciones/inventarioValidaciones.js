const validarRegistrarMovimientoStock = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(
            new Error("Se necesitan los datos del movimiento para registrarlo."),
            { status: 400 }
        );
    }

    const { idInsumo, cantidadMovimiento, tipoMovimiento } = datos;

    if (!idInsumo || typeof idInsumo !== "number") {
        throw Object.assign(
            new Error("Se necesita el id del insumo."),
            { status: 400 }
        );
    }

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
    
    const tiposPermitidos = ["entrada", "salida"];
    if (!tiposPermitidos.includes(tipoMovimiento)) {
        throw Object.assign(
            new Error("El tipo de movimiento debe ser 'entrada' o 'salida'."),
            { status: 400 }
        );
    }
};

module.exports={
    validarRegistrarMovimientoStock
}
