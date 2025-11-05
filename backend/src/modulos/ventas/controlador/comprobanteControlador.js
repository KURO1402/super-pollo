const { obtenerTiposComprobanteService } = require("../servicio/comprobantesServicio")

const listarTiposComprobantes = async (req, res) => {
    try {
        const tiposComprobantes = await obtenerTiposComprobanteService();
        return res.status(200).json({
            ok: true,
            tiposComprobantes
        });
    } catch (err) {
        return res.status(err.status || 500).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
}

module.exports = {
    listarTiposComprobantes
}