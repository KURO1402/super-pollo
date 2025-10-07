//Importamos validaciones
const { validarDatosVenta } = require("../../../utilidades/validacionesVenta")

//Importamos el helper de ventas
const { formatearDataVenta } = require("../../../helpers/ventas-helpers/formatearDataVenta");

// Importamos servicios necesarios
const { obtenerDatosComprobanteService } = require("../servicio/comprobantesServicio");
const { actualizarCorrelativoService } = require("../servicio/comprobantesServicio");
// Servicio de nubefact
const { generarComprobanteNubefact } = require("../../../servicios/nubefact");


// Función principal del servicio
const registrarVentaService = async (datosVenta) => {
  try {
    // 1. Validaciones iniciales
    await validarDatosVenta(datosVenta);
    // 2. Obtener datos del comprobante (solo lectura)
    const datosComprobante = await obtenerDatosComprobanteService(datosVenta.tipoComprobante);

    const dataFormateada = formatearDataVenta(datosVenta, datosComprobante);
    return dataFormateada;
    
/*
    // 3. Preparar datos de la venta
    const dataFormateada = procesarVenta(datosVenta, datosComprobante);

    // 4. Enviar a Nubefact
    const respuestaNubefact = await generarComprobanteNubefact(dataFormateada);

    // 5. Si Nubefact devuelve comprobante válido, actualizamos correlativo
    if (respuestaNubefact && respuestaNubefact.serie && respuestaNubefact.numero && respuestaNubefact.enlace_del_pdf) {
      await actualizarCorrelativoService(datosVenta.tipoComprobante);
    }

    return respuestaNubefact;*/
  } catch (error) {
    console.error('Error en servicio de ventas:', error.message);
    if (!error.status) error.status = 500;
    throw error;
  }
};

module.exports = {
  registrarVentaService
};
