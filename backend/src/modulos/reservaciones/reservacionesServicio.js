const {
  registrarReservacionModel,
  listarMesasDisponiblesModel
} = require("./reservacionesModelo.js");

const { convertirA24Horas } = require("../../helpers/formatearTiempo")
const {
  validarDatosReservacion
} = require("./reservacionesValidaciones.js");
const { validarFormatoFecha, validarFormatoHora } = require("../../utilidades/validaciones");

//const { registrarIngresoCajaModel } = require("../caja/cajaModelo.js");

const registrarReservacionService = async (datos, idUsuario) => {
  await validarDatosReservacion(datos);

  const { fechaReservacion, horaReservacion, mesas } = datos;

  const horaFormateada = convertirA24Horas(horaReservacion);
  const mesasDisponibles = await listarMesasDisponiblesModel(
    fechaReservacion,
    horaFormateada
  );

  const idsDisponibles = new Set(mesasDisponibles.map(m => m.idMesa));

  for (const mesa of mesas) {
    if (!mesa.idMesa || typeof mesa.idMesa !== "number") {
      throw Object.assign(new Error("Seleccione una mesa válida"), { status: 400 });
    }

    if (!idsDisponibles.has(mesa.idMesa)) {
      throw Object.assign(
        new Error(`La mesa ${mesa.idMesa} no está disponible, seleccione otra mesa`),
        { status: 400 }
      );
    }
  }

  const [h, m] = horaFormateada.split(":").map(Number);
  const fechaHoraFin = new Date();
  fechaHoraFin.setHours(h);
  fechaHoraFin.setMinutes(m + 90);
  fechaHoraFin.setSeconds(0);

  const horaFin = fechaHoraFin.toTimeString().slice(0, 8);

  const codigoAcceso = Math.floor(100000 + Math.random() * 900000).toString();

  const fechaExpiracion = new Date();
  fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 20);

  const expiracionPago = fechaExpiracion.toISOString().slice(0, 19).replace("T", " ");

  const resultado = await registrarReservacionModel(
    datos,
    horaFormateada,
    horaFin,
    codigoAcceso,
    expiracionPago,
    idUsuario
  );

  return {
    ok: true,
    mensaje: resultado,
    codigo: codigoAcceso
  };
};

const listarMesasDisponiblesService = async (fechaReserva, horaReserva) => {
  if (!fechaReserva || typeof fechaReserva !== "string" || !fechaReserva.trim() || !validarFormatoFecha(fechaReserva)) {
    throw Object.assign(new Error("Se necesita la fecha de reserva"), { status: 400 });
  }
  if (!horaReserva || typeof horaReserva !== "string" || !horaReserva.trim() || !validarFormatoHora(horaReserva)) {
    throw Object.assign(new Error("Se necesita la hora de reserva"), { status: 400 });
  }
  const horaFormateada = convertirA24Horas(horaReserva);
  const mesasDisponibles = await listarMesasDisponiblesModel(fechaReserva, horaFormateada);
  return {
    ok: true,
    mesas: mesasDisponibles
  }
}

module.exports = {
  registrarReservacionService,
  listarMesasDisponiblesService
};
