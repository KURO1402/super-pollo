//Importamos el modelo
const jwt = require("jsonwebtoken");
const {
  registrarMovimientoStockModel,
  obtenerMovimientosPaginacionModel,
  buscarMovimientosPorFechaModel,
  buscarMovimientosPorInsumoModel,
  buscarMovimientosPorUsuarioModel,
  buscarMovimientosPorTipoModel
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

const obtenerMovimientosPaginacionService = async (limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const movimientos = await obtenerMovimientosPaginacionModel(limite, desplazamiento);

  if (!movimientos || movimientos.length === 0) {
    throw Object.assign(
      new Error("No existen movimientos."),
      { status: 404 }
    );
  }

  return {
    ok: true,
    movimientos: movimientos
  };
};

const buscarMovimientosPorInsumoService = async (nombreInsumo, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const movimientos = await buscarMovimientosPorInsumoModel(nombreInsumo, limite, desplazamiento);

  if (!movimientos || movimientos.length === 0) {
    throw Object.assign(
      new Error("No existen movimientos para el insumo especificado."),
      { status: 404 }
    );
  }

  return {
    ok: true,
    movimientos
  };
};

const buscarMovimientosPorUsuarioService = async (nombreApellido, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const movimientos = await buscarMovimientosPorUsuarioModel(nombreApellido, limite, desplazamiento);

  if (!movimientos || movimientos.length === 0) {
    throw Object.assign(
      new Error("No existen movimientos para el usuario especificado."),
      { status: 404 }
    );
  }

  return {
    ok: true,
    movimientos
  };
};

const buscarMovimientosPorFechaService = async (fechaInicio, fechaFin, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const movimientos = await buscarMovimientosPorFechaModel(fechaInicio, fechaFin, limite, desplazamiento);

  if (!movimientos || movimientos.length === 0) {
    throw Object.assign(
      new Error("No existen movimientos en el rango de fechas especificado."),
      { status: 404 }
    );
  }

  return {
    ok: true,
    movimientos
  };
};

const buscarMovimientosPorTipoService = async (tipoMovimiento, limit, offset) => {
  const limite = parseInt(limit) || 10;
  const desplazamiento = parseInt(offset) || 0;

  const movimientos = await buscarMovimientosPorTipoModel(tipoMovimiento, limite, desplazamiento);

  if (!movimientos || movimientos.length === 0) {
    throw Object.assign(
      new Error("No existen movimientos para el tipo de movimiento especificado."),
      { status: 404 }
    );
  }

  return {
    ok: true,
    movimientos
  };
};




module.exports = {
  registrarMovimientoStockService,
  obtenerMovimientosPaginacionService,
  buscarMovimientosPorInsumoService,
  buscarMovimientosPorUsuarioService,
  buscarMovimientosPorFechaService,
  buscarMovimientosPorTipoService
};