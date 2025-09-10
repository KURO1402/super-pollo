const { registrarUsuarioService } = require("./usuarioServicio");

const insertarUsuarioController = async (req, res) => {
  try {
    // 1. Registrar usuario mediante el servicio
    const { usuario, accessToken, refreshToken } = await registrarUsuarioService(req.body);

    // 2. Configurar cookie de refresh token con opciones de seguridad
    const cookieOptions = {
      httpOnly: true,     // Previene acceso via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS solo en producción
      sameSite: "Strict", // Protección contra CSRF
      maxAge: 20 * 60 * 60 * 1000 // 20 horas en milisegundos
    };
    
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // 3. Respuesta exitosa
    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado exitosamente",
      usuario,
      accessToken
    });
    
  } catch (err) {
    // 4. Manejo centralizado de errores
    console.error("Error en insertarUsuarioController:", err.message);

    // Determinar código de estado (usar 500 por defecto si no está especificado)
    const statusCode = err.status || 500;
    
    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

module.exports = insertarUsuarioController;