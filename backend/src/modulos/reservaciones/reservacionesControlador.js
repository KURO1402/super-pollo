const {
  registrarReservacionService
} = require("./reservacionesServicio.js");

const registrarReservacionController = async (req, res) => {
  try {
    const { idUsuario } = req.usuario;
    const resultado = await registrarReservacionService(req.body, idUsuario);
    return res.status(201).json({ ok: true, resultado});
  } catch (err) {
    return res.status(err.status || 500).json({ ok: false, mensaje: err.message });
  }
};

module.exports = {
  registrarReservacionController
};
