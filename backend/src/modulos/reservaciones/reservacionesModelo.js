// importamos la conexión a la base de datos
const pool = require("../../config/conexionDB.js");

// MODELO: registrar reservación completa (reservación + detalles + actualización de mesa)
const registrarReservacionModel = async (datos) => {
  const { fechaReservacion, horaReservacion, cantidadPersonas, idUsuario, idMesa, detalles } = datos;
  let conexion;

  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();

    // Insertar la reservación
    const [resultado] = await conexion.query("CALL insertarReservacion(?, ?, ?, ?, ?)", [
      fechaReservacion,
      horaReservacion,
      cantidadPersonas,
      idUsuario,
      idMesa,
    ]);

    // Obtenemos el id de la reservación recién creada
    const idReservacion = resultado[0][0].idReservacion;

    // Insertar los detalles de la reservación
    for (const detalle of detalles) {
      const { cantidadProductoReservacion, precioUnitario, idProducto } = detalle;
      await conexion.query("CALL insertarDetalleReservacion(?, ?, ?, ?)", [
        cantidadProductoReservacion,
        precioUnitario,
        idReservacion,
        idProducto,
      ]);
    }

    // Actualizar el estado de la mesa a "reservada"
    await conexion.query("UPDATE mesas SET estadoMesa = 'reservada' WHERE idMesa = ?", [idMesa]);

    // Confirmar la transacción
    await conexion.commit();

    return { mensaje: "Reservación registrada exitosamente", idReservacion };

  } catch (err) {
    if (conexion) await conexion.rollback();
    console.error("Error en registrarReservacionModel:", err.message);
    throw new Error("Error al registrar la reservación");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para listar reservaciones por página
const listarReservacionesModel = async (pagina) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL listarReservaciones(?)", [pagina]);
    return result[0];
  } catch (err) {
    console.error("Error en listarReservacionesModel:", err.message);
    throw new Error("Error al listar reservaciones");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para obtener una reservacion por id
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

// modelo para actualizar una reservacion
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
    if (conexion) await conexion.rollback();
    console.error("Error en actualizarReservacionModel:", err.message);
    throw new Error("Error al actualizar reservación");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para insertar pago
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
    console.error("Error en insertarPagoModel:", err.message);
    throw new Error("Error al registrar pago");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para actualizar estado del pago
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
    console.error("Error en actualizarPagoModel:", err.message);
    throw new Error("Error al actualizar estado del pago");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para obtener pago por id de reservacion
const obtenerPagoModel = async (idReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL obtenerPago(?)", [idReservacion]);
    return result[0];
  } catch (err) {
    console.error("Error en obtenerPagoModel:", err.message);
    throw new Error("Error al obtener pago");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para obtener detalle de reservacion por id
const obtenerDetalleReservacionModel = async (idReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL obtenerDetalleReservacion(?)", [idReservacion]);
    return result[0];
  } catch (err) {
    console.error("Error en obtenerDetalleReservacionModel:", err.message);
    throw new Error("Error al obtener detalle de reservacion");
  } finally {
    if (conexion) conexion.release();
  }
};

// modelo para mostrar mesas disponibles por fecha y hora
const listarMesasDisponiblesModel = async (fechaReservacion, horaReservacion) => {
  let conexion;
  try {
    conexion = await pool.getConnection();
    const [result] = await conexion.query("CALL listarMesasDisponibles(?, ?)", [fechaReservacion, horaReservacion]);
    return result[0];
  } catch (err) {
    console.error("Error en listarMesasDisponiblesModel:", err.message);
    throw new Error("Error al obtener mesas disponibles");
  } finally {
    if (conexion) conexion.release();
  }
};

// exportamos los modulos
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
};