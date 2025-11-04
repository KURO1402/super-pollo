require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registrarUsuarioValidacion } = require("./autenticacionValidaciones");
const { registrarUsuarioModel, seleccionarUsuarioCorreoModel, obtenerEstadoVerificacionCorreoModel, insertarVerificacionCorreoModel, validarCodigoVerificacionCorreoModel, actualizarVerificacionCorreoModel } = require("./autenticacionModelo.js");
const { validarCorreo } = require('../../utilidades/validaciones.js');
const enviarCorreoVerificacion = require("../../helpers/enviarCorreo")

const registrarUsuarioService = async (datos) => {

  await registrarUsuarioValidacion(datos);

  const usuarioExistente = await seleccionarUsuarioCorreoModel(datos.correoUsuario);

  if (usuarioExistente.length > 0) {
    throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado."), { status: 409 });
  }

  const estado = await obtenerEstadoVerificacionCorreoModel(datos.correoUsuario);

  if (!estado) {
    throw Object.assign(new Error("No se ha generado un código de verificación para este correo."), { status: 400 });
  }

  if (estado.verificado === 0) {
    throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
  }

  const claveEncriptada = await bcrypt.hash(datos.clave, 10);

  const nuevoUsuario = await registrarUsuarioModel(datos, claveEncriptada);

  const accessToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
  );

  const refreshToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "20h" }
  );

  return {
    usuario: nuevoUsuario,
    accessToken,
    refreshToken
  };
};

const insertarVerificacionCorreoService = async (datos) => {
  if(!datos || typeof datos !== "object"){
    throw Object.assign(new Error("Se necesita el correo"), { status: 400 });
  } 
  const { correo } = datos;

  if (!correo || typeof correo !== "string" || correo.trim().length === 0) {
    throw Object.assign(new Error("Se necesita el correo"), { status: 400 });
  };

  validarCorreo(correo);
  const usuarioExistente = await seleccionarUsuarioCorreoModel(correo);
  if (usuarioExistente.length > 0) {
    throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado."), { status: 409 });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  const resultado = await insertarVerificacionCorreoModel(correo, codigo);
  if (resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo verificar el correo"), { status: 500 });
  }
  await enviarCorreoVerificacion(correo, codigo)
  return {
    ok: true,
    mensaje: "Código de verificación enviado correctamente."
  };
};

const validarCodigoVerificacionCorreoService = async (datos) => {
  if(!datos || typeof datos !== "object"){
    throw Object.assign(new Error("Se necesita el correo y codigo de verificación"));
  }
  const { correo, codigo } = datos;

  if (!codigo || typeof codigo !== "string" || codigo.trim().length === 0) {
    throw Object.assign(new Error("Se necesita el codigo de verificación"));
  };

  if (codigo.length !== 6) {
    throw Object.assign(new Error("El codigo debe tener 6 digitos"));
  }

  if (!correo || typeof correo !== "string" || correo.trim().length === 0) {
    throw Object.assign(new Error("Se necesita el correo"));
  };

  validarCorreo(correo);

  const registro = await validarCodigoVerificacionCorreoModel(correo, codigo);

  if (!registro) {
    throw Object.assign(new Error('Código incorrecto'), { status: 400 });
  }

  if (registro.verificado === 1) {
    throw Object.assign(new Error('El correo ya fue validado'), { status: 400 });
  }

  const expiracion = new Date(registro.expiracionVerificacion);

  if (expiracion < new Date()) {
    throw Object.assign(new Error('El código ha expirado, genere uno nuevo'), { status: 400 });
  }

  const respuesta = await actualizarVerificacionCorreoModel(correo, codigo);

  return respuesta;

};

const seleccionarUsuarioService = async (datos) => {
  if(!datos || typeof datos !== "object"){
    throw Object.assign(new Error("Se necesita correo y contraseña para iniciar sesion"), { status: 400 });
  }
  const { email, clave } = datos;

  const camposObligatorios = [email, clave];

  if (camposObligatorios.some(campo => !campo)) {

    throw Object.assign(new Error("Se necesita correo y contraseña para iniciar sesion"), { status: 400 });
  }

  const resultado = await seleccionarUsuarioCorreoModel(email);


  if (resultado.length == 0) {

    throw Object.assign(new Error("Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo."), { status: 401 });
  }

  const usuario = resultado[0];

  const contraseñaValida = await bcrypt.compare(clave, usuario.clave);

  if (!contraseñaValida) {
    
    throw Object.assign(new Error("Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo."), { status: 401 });
  }

  const payload = {
    idUsuario: usuario.idUsuario,
    nombresUsuario: usuario.nombresUsuario,
    apellidosUsuario: usuario.apellidosUsuario,
    idRol: usuario.idRol
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "20h" }
  );

  return {
    usuario: payload,
    accessToken,
    refreshToken
  };
}

const renovarAccessTokenService = async (refreshToken) => {

  const usuario = await new Promise((resolve, reject) => {

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  const nuevoAccessToken = jwt.sign(
    {
      idUsuario: usuario.idUsuario,
      nombresUsuario: usuario.nombresUsuario,
      apellidosUsuario: usuario.apellidosUsuario,
      idRol: usuario.idRol
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return nuevoAccessToken;
};

module.exports = {
  registrarUsuarioService,
  seleccionarUsuarioService,
  renovarAccessTokenService,
  insertarVerificacionCorreoService,
  validarCodigoVerificacionCorreoService
};