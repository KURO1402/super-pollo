const {
  registrarReservacionService,
  listarMesasDisponiblesService
} = require("./reservacionesServicio.js");

const registrarReservacionController = async (req, res) => {
  try {
    const { idUsuario } = req.usuario;
    const resultado = await registrarReservacionService(req.body, idUsuario);
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

const listarMesasDisponiblesController = async (req, res) => {
  try {
    const { fecha, hora } = req.query;
    const resultado = await listarMesasDisponiblesService(fecha, hora);
    return res.status(200).json(resultado);    
  } catch (err) {
    return res.status(err.status || 500).json({ok:false, mensaje: err.message});
  }
}

module.exports = {
  registrarReservacionController,
  listarMesasDisponiblesController
};
