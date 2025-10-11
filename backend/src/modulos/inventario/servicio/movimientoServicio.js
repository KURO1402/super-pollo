//Importamos el modelo
const {
    registrarMovimientoModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
} = require("../modelo/movimientosModelo");

//registrar movimiento
const registrarMovimientoService = async (datos) => {
  // Validaciones basicas temporales //////////
  if (!datos.idInsumo || !datos.tipoMovimiento || !datos.cantidadMovimiento) {
    const error = new Error("Faltan datos obligatorios del movimiento");
    error.status = 400;
    throw error;
  }

  // Validar tipoMovimiento permitido
  if (!["entrada", "salida"].includes(datos.tipoMovimiento)) {
    const error = new Error("El tipo de movimiento debe ser 'entrada' o 'salida'");
    error.status = 400;
    throw error;
  }

  // Validar que la cantidad sea positiva
  if (datos.cantidadMovimiento <= 0) {
    const error = new Error("La cantidad debe ser mayor a 0");
    error.status = 400;
    throw error;
  }

  // Registrar el movimiento 
  const resultado = await registrarMovimientoModel(datos);

  return resultado;
};


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