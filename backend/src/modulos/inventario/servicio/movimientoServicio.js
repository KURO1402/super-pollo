//Importamos el modelo
const jwt = require("jsonwebtoken");
const {
    registrarMovimientoModel,
    listarMovimientosModel,
    obtenerMovimientosPorInsumoModel,
    eliminarMovimientoModel
} = require("../modelo/movimientosModelo");

//validaciones
const {validarDatosMovimiento} =require("../validaciones/movimientoValidaciones")

const registrarMovimientoService = async (datos, token) => {
  if (!token) {
    throw { status: 401, mensaje: "Token no proporcionado" };
  }

  // Decodificar token para obtener idUsuario
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw { status: 401, mensaje: "Token inválido" };
  }

  // Añadir idUsuario a los datos del movimiento
  const datosMovimiento = { ...datos, idUsuario: decodedToken.idUsuario };

  // Validar datos
  const errores = await validarDatosMovimiento(datosMovimiento);
  if (errores.length > 0) {
    throw { status: 400, mensaje: errores.join(", ") };
  }

  // Registrar movimiento
  const resultado = await registrarMovimientoModel(datosMovimiento);
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

// Eliminar un movimiento de stock
const eliminarMovimientoService = async (id) => {
  if (!id) {
    const error = new Error("Debe especificar un ID de movimiento");
    error.status = 400;
    throw error;
  }

  try {
    await eliminarMovimientoModel(id);
    return { mensaje: "Movimiento eliminado correctamente" };
  } catch (error) {
    // Captura errores del procedimiento almacenado
    throw {
      status: 400,
      mensaje: error.sqlMessage || error.message || "Error al eliminar movimiento"
    };
  }
};


module.exports = {
    registrarMovimientoService,
    listarMovimientosService,
    obtenerMovimientosPorInsumoService,
    eliminarMovimientoService
};