// Importar modelos y validaciones
const {
  registrarReservacionModel,
  listarReservacionesModel,
  obtenerReservacionModel,
  actualizarReservacionModel,
  insertarPagoModel,
  actualizarPagoModel,
  obtenerPagoModel,
  obtenerDetalleReservacionModel,
  listarMesasDisponiblesModel,
  obtenerReservasPorUsuarioModel
} = require("./reservacionesModelo.js");

const {
  validarDatosReservacion,
  validarDetalleReservacion,
  validarActualizacionPago,
  validarConsultaMesasDisponibles
} = require("./reservacionesValidaciones.js");

const { registrarIngresoCajaModel } = require("../caja/cajaModelo.js");

// Crear una nueva reservación (reservación + detalles + actualización de mesa)
const registrarReservacionService = async (datos) => {
  // Validar los datos generales de la reservación
  await validarDatosReservacion(datos);

  // Validar los detalles de la reservación
  if (!datos.detalles || !Array.isArray(datos.detalles) || datos.detalles.length === 0) {
    throw Object.assign(new Error("Debe incluir al menos un detalle de reservación"), { status: 400 });
  }

  // Validar cada detalle individualmente
  for (const detalle of datos.detalles) {
    await validarDetalleReservacion(detalle);
  }

  // Registrar todo
  const resultado = await registrarReservacionModel(datos);

  if (!resultado || !resultado.idReservacion) {
    throw Object.assign(new Error("No se pudo registrar la reservación completa"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Reservación registrada correctamente",
    idReservacion: resultado.idReservacion
  };
};

// Listar reservaciones con paginación
const listarReservacionesService = async (pagina = 1) => {
  const reservaciones = await listarReservacionesModel(pagina);
  if (!reservaciones || reservaciones.length === 0) {
    throw Object.assign(new Error("No se encontraron reservaciones"), { status: 404 });
  }
  return reservaciones;
};

// Obtener una reservación por su ID
const obtenerReservacionService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("El idReservacion es obligatorio"), { status: 400 });
  }

  const reservacion = await obtenerReservacionModel(idReservacion);
  if (!reservacion || reservacion.length === 0) {
    throw Object.assign(new Error("No se encontró la reservación"), { status: 404 });
  }

  return reservacion;
};

// Actualizar datos de una reservación
const actualizarReservacionService = async (datos) => {
  if (!datos.idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const resultado = await actualizarReservacionModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo actualizar la reservación"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Reservación actualizada correctamente",
  };
};

// Insertar pago de una reservación
const insertarPagoService = async (datos) => {
  if (!datos.idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const resultado = await insertarPagoModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo registrar el pago"), { status: 500 });
  }
  // Registrar el ingreso en caja después del pago
  await registrarIngresoCajaModel(
    { monto: datos.montoPagado, descripcion: `Pago de reservación con ID ${datos.idReservacion}` },
    datos.idUsuario
  );

  return {
    ok: true,
    mensaje: "Pago registrado correctamente",
  };
};

// Actualizar el estado del pago
const actualizarPagoService = async (datos) => {
  await validarActualizacionPago(datos);

  const resultado = await actualizarPagoModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo actualizar el estado del pago"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Estado del pago actualizado correctamente",
  };
};

// Obtener información del pago asociado a una reservación
const obtenerPagoService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const pago = await obtenerPagoModel(idReservacion);
  if (!pago || pago.length === 0) {
    throw Object.assign(new Error("No se encontró el pago"), { status: 404 });
  }

  return pago;
};

// Obtener los detalles de una reservación específica
const obtenerDetalleReservacionService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const detalles = await obtenerDetalleReservacionModel(idReservacion);
  if (!detalles || detalles.length === 0) {
    throw Object.assign(new Error("No se encontraron detalles para esta reservación"), { status: 404 });
  }

  return detalles;
};

// Servicio para listar mesas disponibles
const listarMesasDisponiblesService = async (fechaReservacion, horaReservacion) => {
  await validarConsultaMesasDisponibles(fechaReservacion, horaReservacion);

  const mesas = await listarMesasDisponiblesModel(fechaReservacion, horaReservacion);
  if (!mesas || mesas.length === 0) {
    throw Object.assign(new Error("No hay mesas disponibles en esa fecha y hora"), { status: 404 });
  }

  return mesas;
};

const obtenerReservasPorUsuarioService = async (idUsuario) => {

  // Obtener las reservas del usuario mediante el modelo
  const reservas = await obtenerReservasPorUsuarioModel(idUsuario);

  // Verificar si se encontraron reservas
  if (!reservas || reservas.length === 0) {
    throw Object.assign(
      new Error("No existen reservas para este usuario."),
      { status: 404 }
    );
  }
  return {
    ok: true,
    reservas: reservas
  };
};

// Exportar servicios
module.exports = {
  registrarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  actualizarPagoService,
  obtenerPagoService,
  obtenerDetalleReservacionService,
  listarMesasDisponiblesService,
  obtenerReservasPorUsuarioService
};
