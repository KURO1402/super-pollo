const { listarMesasDisponiblesModel } = require("./reservacionesModelo");

// Validar datos al registrar una reservación
const validarDatosReservacion = async (datos) => {
  if (!datos || typeof datos !== "object") {
    throw Object.assign(new Error("Se requieren datos de reservación"), { status: 400 });
  }

  const { fechaReservacion, horaReservacion, cantidadPersonas, idUsuario, idMesa } = datos;

  if (!fechaReservacion || !horaReservacion || cantidadPersonas == null || !idUsuario || !idMesa) {
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
  }

  if (typeof cantidadPersonas !== "number" || cantidadPersonas <= 0) {
    throw Object.assign(new Error("Cantidad de personas inválida"), { status: 400 });
  }

  // Límite máximo de personas
  if (cantidadPersonas > 4) {
    throw Object.assign(new Error("No se permiten más de 4 personas por reservación"), { status: 400 });
  }

  if (typeof idUsuario !== "number" || idUsuario <= 0) {
    throw Object.assign(new Error("idUsuario inválido"), { status: 400 });
  }

  if (typeof idMesa !== "number" || idMesa <= 0) {
    throw Object.assign(new Error("idMesa inválido"), { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaReservacion)) {
    throw Object.assign(new Error("Formato de fecha inválido (use YYYY-MM-DD)"), { status: 400 });
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(horaReservacion)) {
    throw Object.assign(new Error("Formato de hora inválido (use HH:MM o HH:MM:SS)"), { status: 400 });
  }

  const fechaHoraISO = new Date(`${fechaReservacion}T${horaReservacion}`);
  if (Number.isNaN(fechaHoraISO.getTime())) {
    throw Object.assign(new Error("Fecha u hora inválida"), { status: 400 });
  }

  const ahora = new Date();
  const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000); // +1 hora
  const max7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

  // Debe reservar con al menos 1 hora de anticipación
  if (fechaHoraISO < unaHoraDespues) {
    throw Object.assign(new Error("Debe reservar con al menos 1 hora de anticipación"), { status: 400 });
  }

  // No puede reservar más de 7 días adelante
  if (fechaHoraISO > max7Dias) {
    throw Object.assign(new Error("No puede reservar con más de 7 días de anticipación"), { status: 400 });
  }

  // Horario permitido
  const hora = fechaHoraISO.getHours();
  if (hora < 12 || hora >= 20) {
    throw Object.assign(new Error("Solo se pueden hacer reservaciones entre las 12:00 y 20:00"), { status: 400 });
  }

  if (typeof listarMesasDisponiblesModel === "function") {
    const mesasDisponibles = await listarMesasDisponiblesModel(fechaReservacion, horaReservacion);
    const mesaDisponible = Array.isArray(mesasDisponibles) && mesasDisponibles.some(m => Number(m.idMesa) === Number(idMesa));
    if (!mesaDisponible) {
      throw Object.assign(new Error("La mesa seleccionada no está disponible en esa fecha y hora"), { status: 400 });
    }
  }
};

// Validar detalle(s) de reservación 
const validarDetalleReservacion = async (detalle) => {
  if (!detalle) {
    throw Object.assign(new Error("Se requieren datos del detalle de reservación"), { status: 400 });
  }

  const detalles = Array.isArray(detalle) ? detalle : [detalle];

  for (const d of detalles) {
    const { cantidadProductoReservacion, precioUnitario, idReservacion, idProducto } = d;

    if (!idProducto || cantidadProductoReservacion == null || precioUnitario == null) {
      throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    }

    if (typeof idProducto !== "number" || idProducto <= 0) {
      throw Object.assign(new Error("idProducto inválido"), { status: 400 });
    }

    if (typeof cantidadProductoReservacion !== "number" || cantidadProductoReservacion <= 0) {
      throw Object.assign(new Error("La cantidad del producto debe ser un número mayor a 0"), { status: 400 });
    }

    // Límite máximo por producto (10)
    if (cantidadProductoReservacion > 10) {
      throw Object.assign(new Error("No puede ordenar más de 10 unidades de un mismo producto"), { status: 400 });
    }
  }
};

// Validar actualización de pago
const validarActualizacionPago = (datos) => {
  if (!datos || typeof datos !== "object") {
    throw Object.assign(new Error("Se requieren datos para actualizar pago"), { status: 400 });
  }

  const { idTransaccion, estadoPago } = datos;

  if (!idTransaccion || !estadoPago) {
    throw Object.assign(new Error("Faltan datos obligatorios para actualizar el pago"), { status: 400 });
  }

  if (typeof idTransaccion !== "string" || idTransaccion.trim() === "") {
    throw Object.assign(new Error("idTransaccion inválido"), { status: 400 });
  }

  if (typeof estadoPago !== "string" || estadoPago.trim() === "") {
    throw Object.assign(new Error("estadoPago inválido"), { status: 400 });
  }
};

// Validar consulta de mesas disponibles
const validarConsultaMesasDisponibles = (fechaReservacion, horaReservacion) => {
  if (!fechaReservacion || !horaReservacion) {
    throw Object.assign(new Error("Se requieren fecha y hora para consultar mesas disponibles"), { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaReservacion)) {
    throw Object.assign(new Error("Formato de fecha inválido (use YYYY-MM-DD)"), { status: 400 });
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(horaReservacion)) {
    throw Object.assign(new Error("Formato de hora inválido (use HH:MM o HH:MM:SS)"), { status: 400 });
  }
};

module.exports = {
  validarDatosReservacion,
  validarDetalleReservacion,
  validarActualizacionPago,
  validarConsultaMesasDisponibles
};
