const { listarMesasDisponiblesModel } = require("./reservacionesModelo");
const { validarFormatoFecha, validarFormatoHora } = require("../../utilidades/validaciones")

const validarDatosReservacion = async (datos) => {
  if (!datos || typeof datos !== "object") {
    throw Object.assign(new Error("Se requieren datos de reservación"), { status: 400 });
  }

  const { fechaReservacion, horaReservacion, mesas, cantidadPersonas } = datos;

  if (!fechaReservacion || typeof fechaReservacion !== "string" || !fechaReservacion.trim() || !validarFormatoFecha(fechaReservacion)) {
    throw Object.assign(new Error("La fecha de reservación no es válida"), { status: 400 });
  }

  if (!horaReservacion || typeof horaReservacion !== "string" || !horaReservacion.trim() || !validarFormatoHora(horaReservacion)) {
    throw Object.assign(new Error("La hora de reservación no es válida"), { status: 400 });
  }

  if (!Array.isArray(mesas) || mesas.length === 0) {
    throw Object.assign(new Error("Seleccione una mesa"), { status: 400 });
  }

  const mesasDisponibles = await listarMesasDisponiblesModel(
    fechaReservacion,
    horaReservacion
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

  if(!cantidadPersonas || typeof cantidadPersonas !== "number" || cantidadPersonas === 0){
    throw Object.assign(new Error("Ingrese la cantidad de personas"), { status: 400 });
  }
};

module.exports = {
  validarDatosReservacion
};
