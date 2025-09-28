const { listarTipoDocumentoService } = require("./fuenteDatosServicio.js");

// CONTROLADOR PARA LISTAR TIPOS DE DOCUMENTO
const listarTipoDocumentoController = async (req, res) => {
  try {
    //Llamar al servicio de listar tipo documento
    const tiposDoc = await listarTipoDocumentoService();

    //Devolvemos los tipos de documento
    return res.status(200).json({
      ok: true,
      tiposDoc,
    });

  } catch (err) {
    // Manejo de errores
    console.error("Error en listarTipoDocumentoController:", err.message);

     // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;

    //Devolvemos el error y un mensaje descriptivo
    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

module.exports = { listarTipoDocumentoController };
