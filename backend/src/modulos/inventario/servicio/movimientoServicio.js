//Importamos el modelo
const {
    registrarMovimientoModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
} = require("../modelo/movimientosModelo");

//validaciones
const {validarDatosMovimiento} =require("../validaciones/movimientoValidaciones")

const registrarMovimientoService = async (datos) => {

  //capturamos los errroes
  const errores = await validarDatosMovimiento(datos);

  if (errores.length > 0) {
    throw {
      status: 400,
      mensaje: errores.join(", ")
    };
  }

  //si la validacion pasa registramos el movimiento
  const resultado = await registrarMovimientoModel(datos);

  return resultado
}

// Listar todos los movimientos
const listarMovimientosService = async () => {
  const movimientos = await listarMovimientosModel();
  return movimientos;
};

// Obtener movimientos de un insumo específico
const obtenerMovimientosPorInsumoService = async (idInsumo) => {
  if (!idInsumo) {
    const error = new Error("Debe especificar un ID de insumo");
    error.status = 400;
    throw error;
  }

  const movimientos = await obtenerMovimientosPorInsumoModel(idInsumo);
  return movimientos;
};

module.exports = {
    registrarMovimientoService,
    listarMovimientosService,
    obtenerMovimientosPorInsumoService,
};