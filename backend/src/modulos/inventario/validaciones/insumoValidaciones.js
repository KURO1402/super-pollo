const validarInsertarInsumo = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw Object.assign(new Error("Se necesitan los datos del nuevo insumo como nombre, unidad de medida y cantidad inical"), { status: 400 });
    };
    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;

    if(!nombreInsumo || typeof nombreInsumo !== "string" || !nombreInsumo.trim()){
        throw Object.assign(new Error("Se necesita el nombre del nuevo insumo"), { status: 400 });
    }
    
    if(cantidadInicial === null || cantidadInicial === undefined || cantidadInicial === NaN || typeof cantidadInicial !== "number"){
        throw Object.assign(new Error("Se necesita la cantidad incial "), { status: 400 });
    }

    if(!unidadMedida || typeof unidadMedida !== "string" || !unidadMedida.trim()){
        throw Object.assign(new Error("Se necesita el la unidad de medida del nuevo insumo"), { status: 400 });
    }

    if(cantidadInicial < 0){
        throw Object.assign(new Error("El stock tiene que ser mayor o igual a 0"), { status: 400 });
    }
};

module.exports = {
    validarInsertarInsumo
};
