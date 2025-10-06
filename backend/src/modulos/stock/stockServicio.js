// Importamos el modelo de insumos
const {
    insertarInsumoModel,
    obtenerInsumosModel,
    obtenerInsumoIDModel,
    actualizarInsumoModel,
    eliminarInsumoModel
} = require("./stockModelo");

// Crear un nuevo insumo
const crearInsumoService = async (datos) => {
    // Validamos campos obligatorios
    if (!datos.nombreInsumo || !datos.unidadMedida || !datos.categoriaProducto) {
        const error = new Error("Faltan datos obligatorios del insumo");
        error.status = 400;
        throw error;
    }

    // Si no viene stock se inicia en 0
    if (datos.stockInsumo === undefined) datos.stockInsumo = 0;

    // Insertamos el insumo en la BD
    const nuevoInsumo = await insertarInsumoModel(datos);

    // Retornamos mensaje con el ID generado
    return {
        mensaje: "Insumo registrado con éxito",
        insumoId: nuevoInsumo.insertId || nuevoInsumo.idInsumo,
    };
};

// Listar todos los insumos
const listarInsumosService = async () => {
    // Obtenemos los registros desde el modelo
    const insumos = await obtenerInsumosModel();
    return insumos;
};

// Obtener un insumo por ID
const obtenerInsumoService = async (id) => {
    // Validamos que se reciba el ID
    if (!id) {
        const error = new Error("Se requiere un ID de insumo");
        error.status = 400;
        throw error;
    }

    // Consultamos en la BD
    const insumo = await obtenerInsumoIDModel(id);

    // Si no existe, lanzamos error 404
    if (!insumo) {
        const error = new Error("Insumo no encontrado");
        error.status = 404;
        throw error;
    }

    return insumo;
};

// Actualizar un insumo
const actualizarInsumoService = async (id, datos) => {
    // Validamos que venga el ID
    if (!id) {
        const error = new Error("Falta el ID del insumo a actualizar");
        error.status = 400;
        throw error;
    }

    // Actualizamos en la BD
    const actualizado = await actualizarInsumoModel(id, datos);

    return {
        mensaje: "Insumo actualizado correctamente",
        data: actualizado
    };
};

// Eliminar un insumo
const eliminarInsumoService = async (id) => {
    if (!id) {
        const error = new Error("Se requiere un ID para eliminar el insumo");
        error.status = 400;
        throw error;
    }

    await eliminarInsumoModel(id);

    return { mensaje: "Insumo eliminado" };
};

// Exportamos los servicios
module.exports = {
    crearInsumoService,
    listarInsumosService,
    obtenerInsumoService,
    actualizarInsumoService,
    eliminarInsumoService
};
