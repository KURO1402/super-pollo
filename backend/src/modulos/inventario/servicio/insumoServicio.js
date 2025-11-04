const {
    insertarInsumoModel,
    obtenerInsumosModel,
    obtenerInsumosPaginacionModel,
    obtenerInsumoIDModel,
    obtenerConteoInsumosPorNombreModel,
    actualizarInsumoModel,
    eliminarInsumoModel
} = require("../modelo/insumoModelo");

const { validarInsertarInsumo } = require("../validaciones/insumoValidaciones");

const insertarInsumoService = async (datos) => {
    validarInsertarInsumo(datos);
    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;
    
    const coincidenciasNombre = await obtenerConteoInsumosPorNombreModel(nombreInsumo);
    if (coincidenciasNombre > 0) { 
        throw Object.assign(
            new Error("El nombre del insumo ya está en uso."),
            { status: 409 }
        );
    }

    const resultado = await insertarInsumoModel(nombreInsumo, cantidadInicial, unidadMedida);

    return {
        ok: true,
        mensaje: resultado
    };
};

const obtenerInsumosService = async () => {
    const insumos = await obtenerInsumosModel();

    if (!insumos || insumos.length === 0) {
        throw Object.assign(
            new Error("No existen insumos registrados."),
            { status: 404 }
        );
    }

    return {
        ok: true,
        insumos: insumos
    };
};

const obtenerInsumosPaginacionService = async (limit, offset) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const insumos = await obtenerInsumosPaginacionModel(limite, desplazamiento);

    if (!insumos || insumos.length === 0) {
        throw Object.assign(
            new Error("No existen insumos en esta página."),
            { status: 404 }
        );
    }

    return {
        ok: true,
        insumos: insumos
    };
};

const obtenerInsumoIDService = async (idInsumo) => {

    if (!idInsumo || isNaN(Number(idInsumo))) {
        throw Object.assign(
            new Error("Se necesita un ID de insumo valido."),
            { status: 400 }
        );
    }

    const insumo = await obtenerInsumoIDModel(Number(idInsumo));

    if (!insumo || insumo.length === 0) {
        const error = new Error("Este insumo no existe.");
        error.status = 404;
        throw error;
    }

    return {
        ok: true, 
        insumo: insumo
    };
};

const actualizarInsumoService = async (idInsumo, datos) => {0.
    if (!idInsumo || isNaN(Number(idInsumo))) {
        throw Object.assign(
            new Error("Se necesita un ID de insumo valido."),
            { status: 400 }
        );
    }
    if(!datos || typeof datos !== "object"){
        throw Object.assign(new Error("Se necesitan los nuevos datos del insumo"), { status: 400 });
    }
    const { nombreInsumo, unidadMedida } = datos;
    if(!nombreInsumo || typeof nombreInsumo !== "string" || !nombreInsumo.trim()){
        throw Object.assign(new Error("Se necesita el nuevo nombre el insumo"), { status: 400 });
    }
    if(!unidadMedida || typeof unidadMedida !== "string" || !unidadMedida.trim()){
        throw Object.assign(new Error("Se necesita la nueva unidad de medida"), { status: 400 });
    }
    const insumo = await obtenerInsumoIDModel(Number(idInsumo));

    if(!insumo || insumo.length === 0){
        throw Object.assign(
            new Error("El insumo especificado no existe."),
            { status: 404 }
        );
    };

    const coincidenciasNombre = await obtenerConteoInsumosPorNombreModel(nombreInsumo);
    if (coincidenciasNombre > 0) {  
        throw Object.assign(
            new Error("El nombre del insumo ya está en uso."),
            { status: 409 }
        );
    }

    const respuesta = await actualizarInsumoModel(idInsumo, nombreInsumo, unidadMedida);

    return {
        ok: true,
        mensaje: respuesta
    };
};

const eliminarInsumoService = async (idInsumo) => {

    if (!idInsumo || isNaN(Number(idInsumo))) {
        throw Object.assign(
            new Error("El ID del insumo proporcionado no es válido."),
            { status: 400 } 
        );
    }

    const insumo = await obtenerInsumoIDModel(idInsumo);
    if (!insumo || insumo.length === 0) {
        throw Object.assign(
            new Error("El insumo no existe"),
            { status: 404 } 
        );
    }

    if(insumo.stockInsumo > 0){
        throw Object.assign(
            new Error("No se puede eliminar un insumo con un stock mayor a 0, vacie el stock primero."),
            { status: 409 } 
        );
    }

    const resultado = await eliminarInsumoModel(idInsumo);

    return { 
        ok: true,
        mensaje: resultado
    };
};

module.exports = {
    insertarInsumoService,
    obtenerInsumosService,
    obtenerInsumosPaginacionService,
    obtenerInsumoIDService,
    actualizarInsumoService,
    eliminarInsumoService
};
