const {
  listarTipoDocumentoModel,
  topProductosMasVendidosModel,
  obtenerResumenVentasEgresosMensualModel,
  obtenerVentasHoyComparacionModel,
  obtenerCantidadVentasHoyComparacionModel,
  obtenerReservasHoyComparacionModel,
  obtenerBalanceGeneralAnualModel,
  obtenerPorcentajeMediosPagoModel,
  obtenerVentasPorMesModel
} = require("./fuenteDatosModelo.js");

const listarTipoDocumentoService = async () => {
  const tipos = await listarTipoDocumentoModel();

  if (!tipos || tipos.length === 0) {
    throw Object.assign(new Error("No se encontraron tipos de documento"), { status: 404 });
  }

  return tipos;
};

const topProductosMasVendidosService = async (fechaInicio, fechaFin) => {
  if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
    throw Object.assign(
      new Error("Debe proporcionar ambas fechas o ninguna."),
      { status: 400 }
    );
  }
  const fechaIni = fechaInicio || null;
  const fechaFi = fechaFin || null;


  const resultado = await topProductosMasVendidosModel(fechaIni, fechaFi);

  return {
    ok: true,
    resultado: resultado
  };
};

const obtenerResumenVentasEgresosMensualService = async (cantidadMeses) => {

  const cantidadMes = cantidadMeses || 6;

  const resultado = await obtenerResumenVentasEgresosMensualModel(cantidadMes);

  return {
    ok: true,
    resultado: resultado
  };
};

const obtenerVentasHoyComparacionService = async () => {
  const resultado = await obtenerVentasHoyComparacionModel();

  return {
    ok: true,
    resultado: resultado
  };
};

const obtenerCantidadVentasHoyComparacionService = async () => {
  const resultado = await obtenerCantidadVentasHoyComparacionModel();

  return {
    ok: true,
    resultado: resultado 
  };
};

const obtenerReservasHoyComparacionService = async () => {
  const resultado = await obtenerReservasHoyComparacionModel();
  return { ok: true, resultado };
};

const obtenerBalanceGeneralAnualService = async () => {

  const resultado = await obtenerBalanceGeneralAnualModel();
  return { ok: true, resultado };
};

const obtenerPorcentajeMediosPagoService = async () => {
  const resultado = await obtenerPorcentajeMediosPagoModel();
  return { ok: true, resultado };
};

const obtenerVentasPorMesService = async (cantidadMeses) => {
  const meses = cantidadMeses || 6;
  const resultado = await obtenerVentasPorMesModel(meses);

  return {
    ok: true,
    resultado: resultado
  };
};


module.exports = {
  listarTipoDocumentoService,
  topProductosMasVendidosService,
  obtenerResumenVentasEgresosMensualService,
  obtenerVentasHoyComparacionService,
  obtenerCantidadVentasHoyComparacionService,
  obtenerReservasHoyComparacionService,
  obtenerBalanceGeneralAnualService,
  obtenerPorcentajeMediosPagoService,
  obtenerVentasPorMesService
};
