const {
    insertarInsumoService,
    obtenerInsumosService,
    obtenerInsumosPaginacionService,
    obtenerInsumoIDService,
    actualizarInsumoService,
    eliminarInsumoService
} = require("../servicio/insumoServicio");

const insertarInsumoController = async (req, res) => {
    try {
        const respuesta = await insertarInsumoService(req.body);

        res.status(201).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerInsumosController = async (req, res) => {
    try {
        const insumos = await obtenerInsumosService();

        return res.status(200).json(insumos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerInsumosPaginacionController = async (req, res) => {
    try {
        const { limit, offset } = req.query;

        const insumos = await obtenerInsumosPaginacionService(limit, offset);

        return res.status(200).json(insumos);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerInsumoIDController = async (req, res) => {
    try {
        const { idInsumo } = req.params;

        const respuesta = await obtenerInsumoIDService(idInsumo);
        res.json(respuesta);
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

const actualizarInsumoController = async (req, res) => {
    try {
        const {idInsumo} = req.params;

        const respuesta = await actualizarInsumoService(idInsumo, req.body);
        res.json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarInsumoController = async (req, res) => {
    try {
        const { idInsumo } = req.params;

        const respuesta = await eliminarInsumoService(idInsumo);

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    insertarInsumoController,
    obtenerInsumosController,
    obtenerInsumosPaginacionController,
    obtenerInsumoIDController,
    actualizarInsumoController,
    eliminarInsumoController
};
