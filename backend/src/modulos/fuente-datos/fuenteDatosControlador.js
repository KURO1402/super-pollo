const { 
  listarTipoDocumentoService,
  topProductosMasVendidosService 
} = require("./fuenteDatosServicio.js");

// CONTROLADOR PARA LISTAR TIPOS DE DOCUMENTO
const listarTipoDocumentoController = async (req, res) => {
  try {
    const tiposDoc = await listarTipoDocumentoService();

    return res.status(200).json({
      ok: true,
      tiposDoc,
    });

  } catch (err) {
    console.error("Error en listarTipoDocumentoController:", err.message);

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const topProductosMasVendidosController = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const resultado = await topProductosMasVendidosService(fechaInicio, fechaFin);

        return res.status(200).json(resultado);

    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            mensaje: error.message || "Error interno en el servidor"
        });
    }
};

module.exports = { 
  listarTipoDocumentoController,
  topProductosMasVendidosController 
};
