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

const registrarReservacionService = async (datos) => {
  await validarDatosReservacion(datos);

  if (!datos.detalles || !Array.isArray(datos.detalles) || datos.detalles.length === 0) {
    throw Object.assign(new Error("Debe incluir al menos un detalle de reservación"), { status: 400 });
  }

  for (const detalle of datos.detalles) {
    await validarDetalleReservacion(detalle);
  }

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

const listarReservacionesService = async (pagina = 1) => {
  const reservaciones = await listarReservacionesModel(pagina);
  if (!reservaciones || reservaciones.length === 0) {
    throw Object.assign(new Error("No se encontraron reservaciones"), { status: 404 });
  }
  return reservaciones;
};

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

const insertarPagoService = async (datos) => {
  if (!datos.idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const resultado = await insertarPagoModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo registrar el pago"), { status: 500 });
  }

  await registrarIngresoCajaModel(
    { monto: datos.montoPagado, descripcion: `Pago de reservación con ID ${datos.idReservacion}` },
    datos.idUsuario
  );

  return {
    ok: true,
    mensaje: "Pago registrado correctamente",
  };
};

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

const listarMesasDisponiblesService = async (fechaReservacion, horaReservacion) => {
  await validarConsultaMesasDisponibles(fechaReservacion, horaReservacion);

  const mesas = await listarMesasDisponiblesModel(fechaReservacion, horaReservacion);
  if (!mesas || mesas.length === 0) {
    throw Object.assign(new Error("No hay mesas disponibles en esa fecha y hora"), { status: 404 });
  }

  return mesas;
};

const obtenerReservasPorUsuarioService = async (idUsuario) => {

  const reservas = await obtenerReservasPorUsuarioModel(idUsuario);

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
