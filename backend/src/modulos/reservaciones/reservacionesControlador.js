// Importamos los servicios
const {
  registrarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  actualizarPagoService,
  obtenerPagoService,
  obtenerDetalleReservacionService,
  listarMesasDisponiblesService
} = require("./reservacionesServicio.js");

// Controlador: Registrar una reservación completa
const registrarReservacionController = async (req, res) => {
  try {
    const result = await registrarReservacionService(req.body);
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    console.error("Error en registrarReservacionController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controlador: Listar reservaciones
const listarReservacionesController = async (req, res) => {
  try {
    const result = await listarReservacionesService(req.query.pagina);
    return res.status(200).json({ ok: true, reservaciones: result });
  } catch (err) {
    console.error("Error en listarReservacionesController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controlador: Obtener una reservación por ID
const obtenerReservacionController = async (req, res) => {
  try {
    const result = await obtenerReservacionService(req.params.id);
    return res.status(200).json({ ok: true, reservacion: result });
  } catch (err) {
    console.error("Error en obtenerReservacionController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controlador: Actualizar una reservación
const actualizarReservacionController = async (req, res) => {
  try {
    const result = await actualizarReservacionService({
      ...req.body,
      idReservacion: req.params.id
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("Error en actualizarReservacionController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controladores de Pagos
const insertarPagoController = async (req, res) => {
  try {
    const result = await insertarPagoService(req.body);
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    console.error("Error en insertarPagoController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const actualizarPagoController = async (req, res) => {
  try {
    const result = await actualizarPagoService(req.body);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("Error en actualizarPagoController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerPagoController = async (req, res) => {
  try {
    const result = await obtenerPagoService(req.params.idReservacion);
    return res.status(200).json({ ok: true, pago: result });
  } catch (err) {
    console.error("Error en obtenerPagoController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controlador: Obtener detalles de una reservación
const obtenerDetalleReservacionController = async (req, res) => {
  try {
    const result = await obtenerDetalleReservacionService(req.params.idReservacion);
    return res.status(200).json({ ok: true, detalle: result });
  } catch (err) {
    console.error("Error en obtenerDetalleReservacionController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Controlador: Listar mesas disponibles por fecha y hora
const listarMesasDisponiblesController = async (req, res) => {
  try {
    const { fecha, hora } = req.query;
    const result = await listarMesasDisponiblesService(fecha, hora);
    return res.status(200).json({ ok: true, mesas: result });
  } catch (err) {
    console.error("Error en listarMesasDisponiblesController:", err.message);
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

// Exportamos los controladores
module.exports = {
  registrarReservacionController,
  listarReservacionesController,
  obtenerReservacionController,
  actualizarReservacionController,
  insertarPagoController,
  actualizarPagoController,
  obtenerPagoController,
  obtenerDetalleReservacionController,
  listarMesasDisponiblesController
};
