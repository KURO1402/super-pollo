//Importamos el modelo
const jwt = require("jsonwebtoken");
const {
  registrarMovimientoStockModel,
  listarMovimientosModel,
  obtenerMovimientosPorInsumoModel,
  eliminarMovimientoModel
} = require("../modelo/movimientosModelo");
const { obtenerInsumoIDModel } = require("../modelo/insumoModelo")

const { validarRegistrarMovimientoStock } = require("../validaciones/inventarioValidaciones")
//validaciones
const registrarMovimientoStockService = async (datos, token) => {
  validarRegistrarMovimientoStock(datos);

  const { idInsumo, cantidadMovimiento, tipoMovimiento, detallesMovimiento } = datos;

  const insumo = await obtenerInsumoIDModel(idInsumo);
  if (!insumo || insumo.length === 0) {
    throw Object.assign(
      new Error("El insumo ingresado es incorrecto."),
      { status: 404 }
    );
  }
  if (tipoMovimiento === "salida" && insumo.stockInsumo < cantidadMovimiento) {
    throw Object.assign(
      new Error("No hay suficiente stock disponible para realizar la salida."),
      { status: 400 }
    );
  }

  let detalle;

  if (typeof detallesMovimiento !== "string" || !detallesMovimiento || !detallesMovimiento.trim()) {
    detalle = "-";
  } else {
    detalle = detallesMovimiento
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const idUsuario = decodedToken.idUsuario;


  // Ejecutar modelo
  const resultado = await registrarMovimientoStockModel(idInsumo, cantidadMovimiento, tipoMovimiento, detalle, idUsuario);

  return {
    ok: true,
    mensaje: resultado
  };
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
  registrarMovimientoStockService,
  listarMovimientosService,
  obtenerMovimientosPorInsumoService,
  eliminarMovimientoService
};