const {
  registrarReservacionModel
} = require("./reservacionesModelo.js");

const { convertirA24Horas } = require("../../helpers/formatearTiempo")
const {
  validarDatosReservacion
} = require("./reservacionesValidaciones.js");

//const { registrarIngresoCajaModel } = require("../caja/cajaModelo.js");

const registrarReservacionService = async (datos, idUsuario) => {
  await validarDatosReservacion(datos);
  const {horaReservacion} = datos
  const horaFormateada = convertirA24Horas(horaReservacion);
  const resultado = await registrarReservacionModel(datos, horaFormateada, idUsuario);

  return {
    ok: true,
    mensaje: "Reservación registrada correctamente",
    idReservacion: resultado
  };
};


module.exports = {
  registrarReservacionService
};
