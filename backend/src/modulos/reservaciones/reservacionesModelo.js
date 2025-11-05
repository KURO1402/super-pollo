const pool = require("../../config/conexionDB.js");

const registrarReservacionModel = async (datos) => {
  const { fechaReservacion, horaReservacion, cantidadPersonas, idUsuario, idMesa, detalles } = datos;
  let conexion;

  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();

    const [resultado] = await conexion.query("CALL insertarReservacion(?, ?, ?, ?, ?)", [
      fechaReservacion,
      horaReservacion,
      cantidadPersonas,
      idUsuario,
      idMesa,
    ]);

    const idReservacion = resultado[0][0].idReservacion;

    for (const detalle of detalles) {
      const { cantidadProductoReservacion, precioUnitario, idProducto } = detalle;
      await conexion.query("CALL insertarDetalleReservacion(?, ?, ?, ?)", [
        cantidadProductoReservacion,
        precioUnitario,
        idReservacion,
        idProducto,
      ]);
    }

    await conexion.query("UPDATE mesas SET estadoMesa = 'reservada' WHERE idMesa = ?", [idMesa]);

    await conexion.commit();

    return { mensaje: "Reservación registrada exitosamente", idReservacion };

  } catch (err) {
    if (conexion) await conexion.rollback();
    throw new Error("Error al registrar la reservación");
  } finally {
    if (conexion) conexion.release();
  }
};

const listarReservacionesModel = async (pagina) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL listarReservaciones(?)", [pagina]);
    return result[0];
  } catch (err) {
    throw new Error("Error al listar reservaciones");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerReservacionModel = async (idReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL obtenerReservacion(?)", [idReservacion]);
    return result[0];
  } catch (err) {
    console.error("Error en obtenerReservacionModel:", err.message);
    throw new Error("Error al obtener reservacion");
  } finally {
    if (conexion) conexion.release();
  }
};

const actualizarReservacionModel = async (datos) => {
  const { idReservacion, fechaReservacion, horaReservacion, cantidadPersonas, estadoReservacion, idMesa } = datos;
  let conexion;
  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();
    await conexion.execute("CALL actualizarReservacion(?, ?, ?, ?, ?, ?)", [
      idReservacion,
      fechaReservacion,
      horaReservacion,
      cantidadPersonas,
      estadoReservacion,
      idMesa,
    ]);
    await conexion.commit();
    return { mensaje: "Reservación actualizada exitosamente" };
  } catch (err) {
    if (conexion) await conexion.rollback();;
    throw new Error("Error al actualizar reservación");
  } finally {
    if (conexion) conexion.release();
  }
};

const insertarPagoModel = async (datos) => {
  const { montoTotal, montoPagado, porcentajePago, idTransaccion, estadoPago, idReservacion } = datos;
  let conexion;
  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();
    await conexion.execute("CALL insertarPago(?, ?, ?, ?, ?, ?)", [
      montoTotal,
      montoPagado,
      porcentajePago,
      idTransaccion,
      estadoPago,
      idReservacion,
    ]);

    await conexion.commit();
    return { mensaje: "Pago registrado exitosamente" };
  } catch (err) {
    if (conexion) await conexion.rollback();
    throw new Error("Error al registrar pago");
  } finally {
    if (conexion) conexion.release();
  }
};

const actualizarPagoModel = async (datos) => {
  const { idTransaccion, estadoPago } = datos;
  let conexion;
  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();
    await conexion.execute("CALL actualizarPago(?, ?)", [idTransaccion, estadoPago]);
    await conexion.commit();
    return { mensaje: "Estado del pago actualizado exitosamente" };
  } catch (err) {
    if (conexion) await conexion.rollback();
    throw new Error("Error al actualizar estado del pago");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerPagoModel = async (idReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL obtenerPago(?)", [idReservacion]);
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener pago");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerDetalleReservacionModel = async (idReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL obtenerDetalleReservacion(?)", [idReservacion]);
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener detalle de reservacion");
  } finally {
    if (conexion) conexion.release();
  }
};

const listarMesasDisponiblesModel = async (fechaReservacion, horaReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL listarMesasDisponibles(?, ?)", [fechaReservacion, horaReservacion]);
    return result[0];
  } catch (err) {
    throw new Error("Error al obtener mesas disponibles");
  } finally {
    if (conexion) conexion.release();
  }
};

const obtenerReservasPorUsuarioModel = async (idUsuario) => {
  let conexion;
  try {
      conexion = await pool.getConnection();

      const [rows] = await conexion.execute("CALL obtenerReservasPorUsuario(?)", [idUsuario]);
      
      return rows[0]; 
  } catch (err) {
      throw new Error("Error al obtener las reservas del usuario");
  } finally {
      if (conexion) conexion.release();
  }
};

module.exports = {
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
};