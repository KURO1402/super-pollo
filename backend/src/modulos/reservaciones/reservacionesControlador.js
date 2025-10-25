// importamos los servicios
const {
  insertarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  obtenerPagoService,
  insertarDetalleReservacionService,
  obtenerDetalleReservacionService
} = require ("./reservacionesServicio.js")

// controlador para insertar reservacion
const insertarReservacionController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await insertarReservacionService(req.body);
    // si todo sale bien devuelve el mensaje de creado correctamente
    return res.status(201).json({ ok: true, ...result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en insertarReservacionController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// controlador para listar reservaciones
const listarReservacionesController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await listarReservacionesService(req.query.pagina);
    // si todo sale bien devuelve el mensaje de exito 
    return res.status(200).json({ ok: true, reservaciones: result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en listarReservacionesController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
} 

// controlador para obtener una reservacion por id
const obtenerReservacionController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await obtenerReservacionService(req.params.id);
    // si todo sale bien devuelve el mensaje de exito 
    return res.status(200).json({ ok: true, reservacion: result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en obtenerReservacionController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
} 

// controlador para actualizar una reservacion por id
const actualizarReservacionController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await actualizarReservacionService({ ...req.body, idReservacion: req.params.id });
    // si todo sale bien devuelve el mensaje de exito
    return res.status(200).json({ ok: true, ...result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en actualizarReservacionController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// controlador para insertar un pago
const insertarPagoController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await insertarPagoService(req.body);
    // si todo sale bien devuelve el mensaje de creado correctamente
    return res.status(201).json({ ok: true, ...result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en insertarPagoController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// controlador para obtener pago de reservacion por id
const obtenerPagoController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await obtenerPagoService(req.params.idReservacion);
    // si todo sale bien devuelve el mensaje de exito
    return res.status(200).json({ ok: true, pago: result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en obtenerPagoController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// controlador para insertar detalle de reservacion
const insertarDetalleReservacionController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await insertarDetalleReservacionService(req.body);
    // si todo sale bien devuelve el mensaje de creado correctamente
    return res.status(201).json({ ok: true, ...result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en insertarDetalleReservacionController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// controlador para obtener detalle de reservacion por id
const obtenerDetalleReservacionController = async (req, res) => {
  try { 
    // llamamos al servicio y esperamos la respuesta
    const result = await obtenerDetalleReservacionService(req.params.idReservacion);
    // si todo sale bien devuelve el mensaje de exito
    return res.status(200).json({ ok: true, detalle: result });
  } catch (err) { // capturar cualquier error del try
    // mostramos el error en consola
    console.error("Error en obtenerDetalleReservacionController:", err.message);
    // devolvemos el mensaje de error con el codigo http especifico
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
}

// exportamos los modulos
module.exports = {
  insertarReservacionController,
  listarReservacionesController,
  obtenerReservacionController,
  actualizarReservacionController,
  insertarPagoController,
  obtenerPagoController,
  insertarDetalleReservacionController,
  obtenerDetalleReservacionController
}
