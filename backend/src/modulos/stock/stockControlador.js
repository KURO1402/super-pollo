// Importamos los servicios de insumos
const {
    crearInsumoService,
    listarInsumosService,
    obtenerInsumoService,
    actualizarInsumoService,
    eliminarInsumoService
} = require("./stockServicio");

// Crear un nuevo insumo
const crearInsumoController = async (req, res) => {
    try {
        // Llamamos al servicio con los datos del body
        const nuevoInsumo = await crearInsumoService(req.body);
        // Respondemos con mensaje y datos del insumo
        res.status(201).json({
            ok: true,
            mensaje: "Insumo creado con éxito",
            data: nuevoInsumo
        });
    } catch (error) {
        // Enviamos error con su código HTTP o 500 por defecto
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Listar todos los insumos
const listarInsumosController = async (req, res) => {
    try {
        const insumos = await listarInsumosService();
        res.json({ ok: true, total: insumos.length, data: insumos });
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Obtener un insumo por su ID
const obtenerInsumoController = async (req, res) => {
    try {
        const insumo = await obtenerInsumoService(req.params.id);
        res.json({ ok: true, data: insumo });
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Actualizar un insumo
const actualizarInsumoController = async (req, res) => {
    try {
        const insumoActualizado = await actualizarInsumoService(req.params.id, req.body);
        res.json({ ok: true, mensaje: "Insumo actualizado", data: insumoActualizado });
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Eliminar un insumo
const eliminarInsumoController = async (req, res) => {
    try {
        await eliminarInsumoService(req.params.id);
        res.json({ ok: true, mensaje: "Insumo eliminado correctamente" });
    } catch (error) {
        res.status(error.status || 500).json({ ok: false, mensaje: error.message });
    }
};

// Exportamos todos los controladores
module.exports = {
    crearInsumoController,
    listarInsumosController,
    obtenerInsumoController,
    actualizarInsumoController,
    eliminarInsumoController
};
