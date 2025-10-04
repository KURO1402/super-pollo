// importamos la conexion a la base de datos
const pool = require("../../config/conexionDB.js");

// modelo para insertar una reservacion
const insertarReservacionModel = async (datos) => {
    // desectructuramos el objeto (datos)
    const { fechaReservacion, horaReservacion, cantidadPersonas, idUsuario, idMesa } = datos;
    let conexion; // declaramos la variable conexion
    try {  
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      await conexion.beginTransaction(); // iniciamos una transaccion 
      // ejecutamos el llamado al procedimiento almacenado
      await conexion.execute("CALL insertarReservacion(?, ?, ?, ?, ?)", [
        fechaReservacion, horaReservacion, cantidadPersonas, idUsuario, idMesa  
      ]);
      // confirmamos que la transaccion fue exitosa
      await conexion.commit();
      return { mensaje: "Reservación registrada exitosamente" };
    } catch (err) { // capturar cualquier error del try
      // si ya se habia abierto la conexion, deshacemos la transaccion
      if (conexion) await conexion.rollback(); 
      // mostramos el error en la consola
      console.error("Error en insertarReservacionModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al registrar reservacion");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para listar reservaciones por pagina
const listarReservacionesModel = async (pagina) => {
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      // ejecutamos el llamado al procedimiento almacenado y obtenemos los resultados
      const [result] = await conexion.query("CALL listarReservaciones(?)", [pagina]);
      return result[0]; // retornamos el primer nivel de resultados
    } catch (err) { // capturar cualquier error del try
      // mostramos el error en la consola
      console.error("Error en listarReservacionesModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al listar reservaciones");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para obtener una reservacion por id
const obtenerReservacionModel = async (idReservacion) => {
    let conexion; // declaramos la variable conexion
    try {
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      // ejecutamos el llamado al procedimiento almacenado y obtenemos los resultados
      const [result] = await conexion.query("CALL obtenerReservacion(?)", [idReservacion]);
      return result[0]; // retornamos el primer nivel de resultados
    } catch (err) { // capturar cualquier error del try
      // mostramos el error en la consola
      console.error("Error en obtenerReservacionModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al obtener reservacion");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para actualizar una reservacion
const actualizarReservacionModel = async (datos) => {
    // desectructuramos el objeto (datos)
    const { idReservacion, fechaReservacion, horaReservacion, cantidadPersonas, estadoReservacion, idMesa } = datos;
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      await conexion.beginTransaction(); // iniciamos una transaccion 
      // ejecutamos el llamado al procedimiento almacenado
      await conexion.execute("CALL actualizarReservacion(?, ?, ?, ?, ?, ?)", [
        idReservacion, fechaReservacion, horaReservacion, cantidadPersonas, estadoReservacion, idMesa  
      ]);
      // confirmamos que la transaccion fue exitosa
      await conexion.commit();
      return { mensaje: "Reservación actualizada exitosamente" };
    } catch (err) { // capturar cualquier error del try
      // si ya se habia abierto la conexion, deshacemos la transaccion
      if (conexion) await conexion.rollback(); 
      // mostramos el error en la consola
      console.error("Error en actualizarReservacionModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al actualizar reservación");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para insertar pago
const insertarPagoModel = async (datos) => {
    // desectructuramos el objeto (datos)
    const { montoTotal, montoPagado, porcentajePago, idTransaccion, estadoPago, idReservacion } = datos;
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      await conexion.beginTransaction(); // iniciamos una transaccion 
      // ejecutamos el llamado al procedimiento almacenado
      await conexion.execute("CALL insertarPago(?, ?, ?, ?, ?, ?)", [
        montoTotal, montoPagado, porcentajePago, idTransaccion, estadoPago, idReservacion  
      ]);
      // confirmamos que la transaccion fue exitosa
      await conexion.commit();
      return { mensaje: "Pago registrado exitosamente" };
    } catch (err) { // capturar cualquier error del try
      // si ya se habia abierto la conexion, deshacemos la transaccion
      if (conexion) await conexion.rollback(); 
      // mostramos el error en la consola
      console.error("Error en insertarPagoModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al registrar pago");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para obtener pago por id de reservacion
const obtenerPagoModel = async (idReservacion) => {
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      // ejecutamos el llamado al procedimiento almacenado y obtenemos los resultados
      const [result] = await conexion.query("CALL obtenerPago(?)", [idReservacion]);
      return result[0]; // retornamos el primer nivel de resultados
    } catch (err) { // capturar cualquier error del try
      // mostramos el error en la consola
      console.error("Error en obtenerPagoModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al obtener pago");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para insertar un detalle de reservacion
const insertarDetalleReservacionModel = async (datos) => {
    // desectructuramos el objeto (datos)
    const { cantidadProductoReservacion, precioUnitario, idReservacion, idProducto } = datos;
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      await conexion.beginTransaction(); // iniciamos una transaccion 
      // ejecutamos el llamado al procedimiento almacenado
      await conexion.execute("CALL insertarDetalleReservacion(?, ?, ?, ?, ?)", [
        cantidadProductoReservacion, precioUnitario, idReservacion, idProducto  
      ]);
      // confirmamos que la transaccion fue exitosa
      await conexion.commit();
      return { mensaje: "Detalle de reservación registrado exitosamente" };
    } catch (err) { // capturar cualquier error del try
      // si ya se habia abierto la conexion, deshacemos la transaccion
      if (conexion) await conexion.rollback(); 
      // mostramos el error en la consola
      console.error("Error en insertarDetalleReservacionModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al registrar detalle de reservacion");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// modelo para obtener detalle de reservacion por id
const obtenerDetalleReservacionModel = async (idReservacion) => {
    let conexion; // declaramos la variable conexion
    try { 
      conexion = await pool.getConnection(); // pedimos una conexion del pool
      // ejecutamos el llamado al procedimiento almacenado y obtenemos los resultados
      const [result] = await conexion.query("CALL obtenerDetalleReservacion(?)", [idReservacion]);
      return result[0]; // retornamos el primer nivel de resultados
    } catch (err) { // capturar cualquier error del try
      // mostramos el error en la consola
      console.error("Error en obtenerDetalleReservacionModel:", err.message);
      // enviamos el error personalizado al controlador
      throw new Error("Error al obtener detalle de reservacion");
      // liberamos la conexion
    } finally {
      if (conexion) conexion.release();
    }
};

// exportamos los modulos
module.exports = {
  insertarReservacionModel,
  listarReservacionesModel,
  obtenerReservacionModel,
  actualizarReservacionModel,
  insertarPagoModel,
  obtenerPagoModel,
  insertarDetalleReservacionModel,
  obtenerDetalleReservacionModel
};