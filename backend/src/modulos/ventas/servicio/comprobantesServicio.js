const { obtenerTiposComprobantesModel, obtenerSerieComprobanteModel, obtenerUltimoCorrelativoModel, actualizarCorrelativoModel } = require("../modelo/comprobantesModelo")

//Obtener todos los tipos de comprobante
const obtenerTiposComprobanteService = async () => {
    const tiposComprobantes = await obtenerTiposComprobantesModel();
    
    if(tiposComprobantes.length === 0){
        const error = new Error('No se encontraron tipos de comprobante');
        error.status = 404;
        throw error;
    }

    return tiposComprobantes;
}

// Obtener datos del comprobante (solo lectura)
const obtenerDatosComprobanteService = async (tipoComprobante) => {
  const [serieDB, correlativoDB] = await Promise.all([
    obtenerSerieComprobanteModel(tipoComprobante),
    obtenerUltimoCorrelativoModel(tipoComprobante)
  ]);

  if (!serieDB || serieDB.length === 0) {
    const error = new Error('No se pudo obtener la serie del comprobante');
    error.status = 404;
    throw error;
  }

  if (!correlativoDB || correlativoDB.length === 0) {
    const error = new Error('No se pudo obtener el correlativo del comprobante');
    error.status = 404;
    throw error;
  }

  return {
    serie: serieDB[0].serie,
    ultimoCorrelativo: correlativoDB[0].ultimoNumero // Aquí lo cambié
  };
};

//Actualizar numero correlativo 
const actualizarCorrelativoService = async (idComprobante) => {
  try {
    const tiposComprobante = await obtenerTiposComprobantesModel();

    if(!idComprobante || idComprobante > tiposComprobante.length ){
        const error = new Error("Tipo de comprobante invalido");
        error.status = 400;
        throw error;
    }
    const actualizado = await actualizarCorrelativoModel(idComprobante);

    if (!actualizado) {
      const error = new Error("No se pudo actualizar el correlativo");
      error.status = 500;
      throw error;
    }

    return { 
      success: true, 
      message: "Correlativo actualizado correctamente" 
    };

  } catch (error) {
    console.error("Error en actualizarCorrelativoService:", error.message);
    if (!error.status) error.status = 500;
    throw error;
  }
};

module.exports = {
    obtenerTiposComprobanteService,
    obtenerDatosComprobanteService,
    actualizarCorrelativoService
}