const {
  registrarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  actualizarPagoService,
  obtenerPagoService,
  obtenerDetalleReservacionService,
  listarMesasDisponiblesService,
  obtenerReservasPorUsuarioService
} = require("./reservacionesServicio.js");

const registrarReservacionController = async (req, res) => {
  try {
    const result = await registrarReservacionService(req.body);
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const listarReservacionesController = async (req, res) => {
  try {
    const result = await listarReservacionesService(req.query.pagina);
    return res.status(200).json({ ok: true, reservaciones: result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerReservacionController = async (req, res) => {
  try {
    const result = await obtenerReservacionService(req.params.id);
    return res.status(200).json({ ok: true, reservacion: result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const actualizarReservacionController = async (req, res) => {
  try {
    const result = await actualizarReservacionService({
      ...req.body,
      idReservacion: req.params.id
    });
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const insertarPagoController = async (req, res) => {
  try {
    const datos = {
      ...req.body,
      idUsuario: req.usuario?.idUsuario
    };

    const result = await insertarPagoService(datos);
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const actualizarPagoController = async (req, res) => {
  try {
    const result = await actualizarPagoService(req.body);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerPagoController = async (req, res) => {
  try {
    const result = await obtenerPagoService(req.params.idReservacion);
    return res.status(200).json({ ok: true, pago: result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerDetalleReservacionController = async (req, res) => {
  try {
    const result = await obtenerDetalleReservacionService(req.params.idReservacion);
    return res.status(200).json({ ok: true, detalle: result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const listarMesasDisponiblesController = async (req, res) => {
  try {
    const { fecha, hora } = req.query;
    const result = await listarMesasDisponiblesService(fecha, hora);
    return res.status(200).json({ ok: true, mesas: result });
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const obtenerReservasPorUsuarioController = async (req, res) => {
  try {
    const { idUsuario } = req.usuario;
    const resultado = await obtenerReservasPorUsuarioService(idUsuario);

    return res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor"
    });
  }
};

module.exports = {
  registrarReservacionController,
  listarReservacionesController,
  obtenerReservacionController,
  actualizarReservacionController,
  insertarPagoController,
  actualizarPagoController,
  obtenerPagoController,
  obtenerDetalleReservacionController,
  listarMesasDisponiblesController,
  obtenerReservasPorUsuarioController
};
