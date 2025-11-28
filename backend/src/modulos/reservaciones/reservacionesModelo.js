const pool = require("../../config/conexionDB.js");

const registrarReservacionModel = async (
  datos,
  horaFormateada,
  horaFin,
  codigoAcceso,
  expiracionPago,
  idUsuario
) => {
  let conexion;

  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();

    const { fechaReservacion, cantidadPersonas, mesas } = datos;

    const [result] = await conexion.query(
      "CALL registrarReservacion(?, ?, ?, ?, ?, ?, ?)",
      [
        fechaReservacion,
        horaFormateada,
        horaFin,
        cantidadPersonas,
        codigoAcceso,
        expiracionPago,
        idUsuario
      ]
    );

    const idReserva = result[0][0].idReserva;

    for (const mesa of mesas) {
      await conexion.query(
        "CALL registrarReservacionMesa(?, ?)",
        [idReserva, mesa.idMesa]
      );
    }

    await conexion.commit();

    return idReserva;

  } catch (err) {
    if (conexion) await conexion.rollback();
    console.error("Error al registrar reserva:", err.message);
    throw new Error("Error al registrar reserva en la base de datos");

  } finally {
    if (conexion) conexion.release();
  }
};

const listarMesasDisponiblesModel = async (fecha, hora) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [rows] = await conexion.execute("CALL listarMesasDisponibles(?,?)",[fecha, hora]);
    return rows[0];
  } catch (err) {
    if (conexion) await conexion.rollback();
    console.error("Error al listar mesas:", err.message);
    throw new Error("Error al listar mesas disponibles");

  } finally {
    if (conexion) conexion.release();
  }
} 

module.exports = {
  registrarReservacionModel,
  listarMesasDisponiblesModel
};