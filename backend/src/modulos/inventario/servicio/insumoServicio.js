// Importamos el modelo de insumos
const {
    insertarInsumoModel,
    obtenerInsumosModel,
    obtenerInsumosPaginacionModel,
    obtenerInsumoIDModel,
    obtenerConteoInsumosPorNombreModel,
    actualizarInsumoModel,
    eliminarInsumoModel
} = require("../modelo/insumoModelo");

// Crear un nuevo insumo
const { validarInsertarInsumo, validarDatosInsumo } = require("../validaciones/insumoValidaciones");//validaciones

// Crear un nuevo insumo
const insertarInsumoService = async (datos) => {
    validarInsertarInsumo(datos);
    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;
    
    const coincidenciasNombre = await obtenerConteoInsumosPorNombreModel(nombreInsumo);
    if (coincidenciasNombre > 0) {  // Si ya existe un insumo con el mismo nombre
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

// Listar todos los insumos
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

//Listar insumos por paginacion
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

// Obtener un insumo por ID
const obtenerInsumoIDService = async (idInsumo) => {
    // Validamos que se reciba el ID
    if (!idInsumo || isNaN(Number(idInsumo))) {
        throw Object.assign(
            new Error("Se necesita un ID de insumo valido."),
            { status: 400 }
        );
    }

    // Consultamos en la BD
    const insumo = await obtenerInsumoIDModel(Number(idInsumo));

    // Si no existe, lanzamos error 404
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

// Actualizar un insumo
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
    if (coincidenciasNombre > 0) {  // Si ya existe un insumo con el mismo nombre
        throw Object.assign(
            new Error("El nombre del insumo ya está en uso."),
            { status: 409 }
        );
    }

    // Actualizamos en la BD
    const respuesta = await actualizarInsumoModel(idInsumo, nombreInsumo, unidadMedida);

    return {
        ok: true,
        mensaje: respuesta
    };
};

// Eliminar un insumo
const eliminarInsumoService = async (idInsumo) => {
    // Validar el parámetro recibido
    if (!idInsumo || isNaN(Number(idInsumo))) {
        throw Object.assign(
            new Error("El ID del insumo proporcionado no es válido."),
            { status: 400 } // Bad Request
        );
    }

    // Verificar si el insumo existe
    const insumo = await obtenerInsumoIDModel(idInsumo);
    if (!insumo || insumo.length === 0) {
        throw Object.assign(
            new Error("El insumo no existe"),
            { status: 404 } // Not Found
        );
    }

    if(insumo.stockInsumo > 0){
        throw Object.assign(
            new Error("No se puede eliminar un insumo con un stock mayor a 0, vacie el stock primero."),
            { status: 409 } // Not Found
        );
    }

    // Ejecutar la eliminación (actualización lógica)
    const resultado = await eliminarInsumoModel(idInsumo);

    // Retornar respuesta exitosa
    return { 
        ok: true,
        mensaje: resultado
    };
};

// Exportamos los servicios
module.exports = {
    insertarInsumoService,
    obtenerInsumosService,
    obtenerInsumosPaginacionService,
    obtenerInsumoIDService,
    actualizarInsumoService,
    eliminarInsumoService
};
