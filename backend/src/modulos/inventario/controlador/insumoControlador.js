// Importamos los servicios de insumos
const {
    insertarInsumoService,
    obtenerInsumosService,
    obtenerInsumosPaginacionService,
    obtenerInsumoIDService,
    actualizarInsumoService,
    eliminarInsumoService
} = require("../servicio/insumoServicio");

// Crear un nuevo insumo
const insertarInsumoController = async (req, res) => {
    try {
        // Llamamos al servicio con los datos del body
        const respuesta = await insertarInsumoService(req.body);
        // Respondemos con mensaje y datos del insumo
        res.status(201).json(respuesta);
    } catch (err) {
        console.error("Error en insertarInsumoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Listar todos los insumos
const obtenerInsumosController = async (req, res) => {
    try {
        const insumos = await obtenerInsumosService();

        return res.status(200).json(insumos);
    } catch (err) {
        console.error("Error en listarInsumosController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

//Obtener insumos por paginacion
const obtenerInsumosPaginacionController = async (req, res) => {
    try {
        const { limit, offset } = req.query;

        const insumos = await obtenerInsumosPaginacionService(limit, offset);

        return res.status(200).json(insumos);
    } catch (err) {
        console.error("Error en obtenerInsumosPaginacionController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Obtener un insumo por su ID
const obtenerInsumoIDController = async (req, res) => {
    try {
        const { idInsumo } = req.params;

        const respuesta = await obtenerInsumoIDService(idInsumo);
        res.json(respuesta);
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Actualizar un insumo
const actualizarInsumoController = async (req, res) => {
    try {
        const {idInsumo} = req.params;

        const respuesta = await actualizarInsumoService(idInsumo, req.body);
        res.json(respuesta);
    } catch (err) {
        console.error("Error en actualizarInsumoController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

// Eliminar un insumo
const eliminarInsumoController = async (req, res) => {
    try {
        const { idInsumo } = req.params;

        const respuesta = await eliminarInsumoService(idInsumo);

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Exportamos todos los controladores
module.exports = {
    insertarInsumoController,
    obtenerInsumosController,
    obtenerInsumosPaginacionController,
    obtenerInsumoIDController,
    actualizarInsumoController,
    eliminarInsumoController
};
