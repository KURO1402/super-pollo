const pool = require("../../config/conexionDB.js");

const registrarReservacionModel = async (datos, horaFormateada, idUsuario) => {
  let conexion;
  try {
    conexion = await pool.getConnection;
    const {fechaReservacion, mesas} = datos;
    const [result] = await conexion.execute("CALL registrarReservacion(?, ?, ?, ?, ?)", []);
  } catch (err) {
    console.error("Error al registrar reserva en la base de datos");
    throw new Error("Error al registrar reserva en la base de datos");
  } finally {
    if(conexion) conexion.release();
  }
};



module.exports = {
  registrarReservacionModel
};