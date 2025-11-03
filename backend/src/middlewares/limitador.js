const rateLimit = require("express-rate-limit");

const limitador = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 25, // Máximo 25 peticiones por minuto por IP
  message: {
    ok: false,
    mensaje: "Demasiadas peticiones. Intenta de nuevo en 1 minuto."
  }
});

module.exports = limitador;
