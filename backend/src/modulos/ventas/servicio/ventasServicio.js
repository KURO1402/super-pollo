//Importamos validaciones
const { validarDatosVenta } = require("../../../utilidades/validacionesVenta")

//Importamos el helper de ventas
const { formatearVenta } = require("../../../helpers/ventas-helpers/formatearDataVenta");

// Importamos servicios necesarios
const { obtenerDatosComprobanteService } = require("../servicio/comprobantesServicio");
const { actualizarCorrelativoService } = require("../servicio/comprobantesServicio");
// Servicio de nubefact
const { generarComprobanteNubefact } = require("../../../servicios/nubefact");


// Función principal del servicio
const registrarVentaService = async (datosVenta) => {
  try {
    // Validaciones iniciales
    await validarDatosVenta(datosVenta);
    // Obtener datos del comprobante (solo lectura)
    const datosComprobante = await obtenerDatosComprobanteService(datosVenta.tipoComprobante);

    // Sumar +1 al ultimo correlativo
    const nuevoCorrelativo = datosComprobante.ultimoCorrelativo + 1;
    datosComprobante.ultimoCorrelativo = nuevoCorrelativo;

    const dataFormateada = formatearVenta(datosVenta, datosComprobante);

    // Enviar a Nubefact
    const respuestaNubefact = await generarComprobanteNubefact(dataFormateada);

    // Si Nubefact devuelve comprobante válido, actualizamos correlativo
    if (!respuestaNubefact.error && !respuestaNubefact.codigo) {
      await actualizarCorrelativoService(datosVenta.tipoComprobante, nuevoCorrelativo);
    }

    return respuestaNubefact;
  } catch (error) {
    console.error('Error en servicio de ventas:', error.message);
    if (!error.status) error.status = 500;
    throw error;
  }
};

module.exports = {
  registrarVentaService
};
