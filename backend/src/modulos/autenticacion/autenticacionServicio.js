require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registrarUsuarioValidacion } = require("./autenticacionValidaciones");
const { 
  registrarUsuarioModel,
  seleccionarUsuarioCorreoModel, 
  obtenerEstadoVerificacionCorreoModel, 
  insertarVerificacionCorreoModel, 
  validarCodigoVerificacionCorreoModel, 
  actualizarVerificacionCorreoModel 
} = require("./autenticacionModelo.js");

const { obtenerTipoDocumentoPorIdModel } = require("../usuarios/usuarioModelo");
const { validarCorreo } = require('../../utilidades/validaciones.js');
const enviarCorreoVerificacion = require("../../helpers/enviarCorreo")

// FUNCION PARA REGISTRAR USUARIO
const registrarUsuarioService = async (datos) => {
  //Validaciones
  registrarUsuarioValidacion(datos);
  const tipoDoc = await obtenerTipoDocumentoPorIdModel(datos.idTipoDocumento);
  if(!tipoDoc || tipoDoc.nombreTipoDocumento === "RUC" || tipoDoc.nombreTipoDocumento === "ruc"){
    throw Object.assign(new Error("Tipo de documento invalido."), { status: 409 });
  }
  // Validar duplicado de correo
  const usuarioExistente = await seleccionarUsuarioCorreoModel(datos.correoUsuario);
  if (usuarioExistente.length > 0) {
    throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado."), { status: 409 });
  }

  // Verificación de correo
  const estado = await obtenerEstadoVerificacionCorreoModel(datos.correoUsuario);

  if (!estado) {
    throw Object.assign(new Error("No se ha generado un código de verificación para este correo."), { status: 400 });
  }

  if (estado.verificado === 0) {
    throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
  }

  //Encriptar la contraseña - costo de hashing configurado según rendimiento/seguridad(en este caso 10)
  const claveEncriptada = await bcrypt.hash(datos.clave, 10);

  //Insertar usuario en la BD mediante el modelo creado
  const nuevoUsuario = await registrarUsuarioModel(datos, claveEncriptada);

  //Generación de tokens con los datos del usuario y tiempos especificos para cada token
  //Token para realizar modificaciones que se envia al frontend
  const accessToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
  );

  //Token que se envia al frontend por cookie httpOnly, el cual nos sirve para generar mas accessToken cuando se venza el actual accesToken
  const refreshToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "20h" }
  );

  //Devolvemos los datos del usuario y los dos tokens para el controlador
  return {
    usuario: nuevoUsuario,
    accessToken,
    refreshToken
  };
};

// Servicio para registrar un codigo de verificaión de un correo
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

  //Generamos un coodigo de 6 digitos aleatorios
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

// Servicio para validar el codigo de verificacion del correo
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

  // Validaciones en servidor
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

//FUNCION PARA INICIAR SESION
const seleccionarUsuarioService = async (datos) => {
  if(!datos || typeof datos !== "object"){
    throw Object.assign(new Error("Se necesita correo y contraseña para iniciar sesion"), { status: 400 });
  }
  const { email, clave } = datos;
  //Array de campos obligatorios igual que el de registra usuario
  const camposObligatorios = [email, clave];

  //Verificar los campos con some igual que en la de registrar usuario
  if (camposObligatorios.some(campo => !campo)) {
    //Lanzar error para el controlador
    throw Object.assign(new Error("Se necesita correo y contraseña para iniciar sesion"), { status: 400 });
  }
  //Llamamos al modelo que interactua con la BD para traer al usuario
  const resultado = await seleccionarUsuarioCorreoModel(email);

  //Verificamos que el modelo nos ha devuelto un usuario
  if (resultado.length == 0) {
    //Lanzamos un error para el catch del controlador
    throw Object.assign(new Error("Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo."), { status: 401 });
  }

  //Guardamos el usuario en una constante
  const usuario = resultado[0];

  // Verificar contraseña con bcrypt (retorna true si las claves coinciden)
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave);

  //Si es false es decir que las contraseñas no coinciden
  if (!contraseñaValida) {
    //Lanzamos error
    throw Object.assign(new Error("Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo."), { status: 401 });
  }

  // Creamos un objeto con los datos necesarios del usuario para el token y enviar al frontend
  const payload = {
    idUsuario: usuario.idUsuario,
    nombresUsuario: usuario.nombresUsuario,
    apellidosUsuario: usuario.apellidosUsuario,
    idRol: usuario.idRol
  };

  //Mismo manejo que al registrar usuario
  //Creamos el accesToken
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
  );

  //Creamos el refreshToken
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "20h" }
  );

  //Enviamos al controlador el usuario y los dos tokens
  return {
    usuario: payload,
    accessToken,
    refreshToken
  };
}

// REFRESCAR ACCESS TOKEN
const renovarAccessTokenService = async (refreshToken) => {
  // Aquí usamos new Promise porque jwt.verify trabaja con callbacks, para poder decodificar el token con los datos del usuario
  const usuario = await new Promise((resolve, reject) => {
    // Verificamos si el refreshToken es válido y no ha expirado
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) reject(err);// Si hay error (token inválido o expirado) rechazamos la promesa
      else resolve(decoded);// Si todo está bien, resolvemos la promesa con los datos decodificados del usuario
    });
  });

  // Generamos un nuevo accessToken válido por 15 minutos
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

  //Devolvemos el nuevo accestoken para el controlador
  return nuevoAccessToken;
};

//Exportamos modulo
module.exports = {
  registrarUsuarioService,
  seleccionarUsuarioService,
  renovarAccessTokenService,
  insertarVerificacionCorreoService,
  validarCodigoVerificacionCorreoService
};