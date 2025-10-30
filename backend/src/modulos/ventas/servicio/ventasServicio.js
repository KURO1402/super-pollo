//Importamos validaciones
const { validarDatosVentaBoleta } = require("../validaciones/validacionesVenta")

//Importamos el helper de ventas
const { formatearVenta } = require("../../../helpers/ventas-helpers/formatearDataVenta");

const { obtenerProductoPorIdService } = require("../../inventario/servicio/productoServicio")
// Importamos servicios necesarios
const { obtenerDatosComprobanteService } = require("../servicio/comprobantesServicio");
const { actualizarCorrelativoService } = require("../servicio/comprobantesServicio");
// Servicio de nubefact
const { generarComprobanteNubefact } = require("../../../servicios/nubefact");


// Función principal del servicio
const registrarBoletaVentaService = async (datosVenta) => {
  // Validaciones iniciales
  await validarDatosVentaBoleta(datosVenta);

  const { tipoComprobante, datosCliente, productos } = datosVenta;

  //Obtener datos del comprobante (solo lectura)
  const datosComprobante = await obtenerDatosComprobanteService(tipoComprobante);

  // Sumar +1 al ultimo correlativo
  const nuevoCorrelativo = datosComprobante.ultimoCorrelativo + 1;
  datosComprobante.ultimoCorrelativo = nuevoCorrelativo;

  const dataFormateada = formatearVenta(datosVenta, datosComprobante);

  //Enviar a Nubefact
  /*const respuestaNubefact = await generarComprobanteNubefact(dataFormateada);

  // Si Nubefact devuelve comprobante válido, actualizamos correlativo
  /*if (!respuestaNubefact.error && !respuestaNubefact.codigo) {
    await actualizarCorrelativoService(datosVenta.tipoComprobante, nuevoCorrelativo);
  }*/

  return dataFormateada;
};

module.exports = {
  registrarBoletaVentaService
};
