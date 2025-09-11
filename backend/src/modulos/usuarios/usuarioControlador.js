const { registrarUsuarioService, seleccionarUsuarioService } = require("./usuarioServicio");

//CONTROLADOR PAR INSERTAR USUARIO
const insertarUsuarioController = async (req, res) => {
  try {
    //Registrar usuario mediante el servicio y despues el modelo
    const { usuario, accessToken, refreshToken } = await registrarUsuarioService(req.body);

    //Configurar cookie de refresh token con opciones de seguridad
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

//CONTROLADOR PARA INICIAR SESION
const seleccionarUsuarioController = async (req, res) => {
  try {
    // Iniciar seion mediante el servico y controlador
    const resultado = await seleccionarUsuarioService(req.body);

    //desestructuramos el usuario y los dos tokens
    const { usuario, accessToken, refreshToken } = resultado;

    //Configurar cookie para el refreshToken 
    const cookieOptions = {
      httpOnly: true, //Hace que el cleinte no pueda leer la cookie con js
      secure: process.env.NODE_ENV === 'production', //HTTPS cuando se lanze produccion
      sameSite: "Strict", //Protege de CSRF(Cross-Site Request Forgery)
      maxAge: 20 * 60 * 60 * 1000 //Tiempo de la cookie en este caso 20 horas
    };

    //Enviamos el refresh token en la cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Enviamos las respuestas al frontend(mensaje, usuario y el accessToken)
    return res.status(200).json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      usuario,
      accessToken
    });

  } catch (err) {
    //Aqui manejamos los errores del servicio y segun eso enviamos respuesta al cliente
    console.error("Error en seleccionarUsuarioController:", err.message);

    //Capturamos el status del error
    const statusCode = err.status || 500;

    //Enviamos una respuesta al cliente
    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

//Exportamos modulo
module.exports = { insertarUsuarioController, seleccionarUsuarioController };