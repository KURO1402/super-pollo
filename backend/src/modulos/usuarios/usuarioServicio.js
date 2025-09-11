require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validarCorreo, validarDocumento, validarTelefono } = require("../../utilidades/validaciones");
const { insertarUsuarioModel, seleccionarUsuarioModel } = require("./usuarioModelo");

// =====================
// REGISTRAR USUARIO
// =====================
const registrarUsuarioService = async (datos) => {
  // Desestructuración de datos con nombres más concisos
  const {
    nombresUsuario,
    apellidosUsuario,
    correoUsuario,
    clave,
    idTipoDocumento,
    numeroDocumentoUsuario,
    telefonoUsuario
  } = datos;

  // 1) Validación de campos obligatorios usando un array para mejor mantenibilidad
  const camposObligatorios = [
    nombresUsuario, 
    apellidosUsuario, 
    correoUsuario, 
    clave, 
    numeroDocumentoUsuario, 
    telefonoUsuario, 
    idTipoDocumento
  ];
  
  if (camposObligatorios.some(campo => !campo)) {
    const error = new Error("Faltan datos obligatorios");
    error.status = 400;
    throw error;
  }

  // 2) Validaciones específicas con mensajes de error detallados
  if (!validarCorreo(correoUsuario)) {
    throw Object.assign(new Error("Correo electrónico inválido"), { status: 400 });
  }

  if (!validarDocumento(idTipoDocumento, numeroDocumentoUsuario)) {
    throw Object.assign(new Error("Número de documento inválido"), { status: 400 });
  }

  if (clave.length < 8) {
    throw Object.assign(new Error("La contraseña debe tener al menos 8 caracteres"), { status: 400 });
  }

  if (!validarTelefono(telefonoUsuario)) {
    throw Object.assign(new Error("Número de teléfono inválido"), { status: 400 });
  }

  // 3) Verificar duplicado de correo (mantener comentario como recordatorio)
  
  const usuarioExistente = await seleccionarUsuarioModel(correoUsuario);
  if (usuarioExistente.length > 0) {
    const error = new Error("El correo ya está registrado");
    error.status = 409;
    throw error;
  }

  // 4) Encriptar la contraseña - costo de hashing configurado según rendimiento/seguridad
  const claveEncriptada = await bcrypt.hash(clave, 10);

  // 5) Insertar en BD
  const nuevoUsuario = await insertarUsuarioModel(datos, claveEncriptada);
  
  // Extraer ID del usuario insertado
  // 6) Generación de tokens con valores de expiración centralizados
  const accessToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "20m" }
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

const seleccionarUsuarioService = async ({ email, clave }) => {
  const camposObligatorios = [email, clave];

  if (camposObligatorios.some(campo => !campo)) {
    const error = new Error("Faltan datos obligatorios");
    error.status = 400;
    throw error;
  }

  const resultado = await seleccionarUsuarioModel(email);
  if(resultado.length == 0){
    return { mensaje: "Credenciales de acceso invalidas"};
  }

  const usuario = resultado[0];

  // Verificar contraseña con bcrypt (retorna true si las claves coinciden)
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave);

  if(!contraseñaValida){
     return { mensaje: "Credenciales de acceso invalidas"};
  }

  // Solo los campos que quieres en el payload del token
  const payload = {
    idUsuario: usuario.idUsuario,
    nombresUsuario: usuario.nombresUsuario,
    apellidosUsuario: usuario.apellidosUsuario,
    idRol: usuario.idRol
  };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "20m" }
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

/* =====================
// REFRESCAR ACCESS TOKEN
// =====================
const refrescarTokenService = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No hay refresh token" });
  }

  try {
    // Verificar y decodificar el refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generar nuevo access token
    const nuevoAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "20m" }
    );

    return res.json({ accessToken: nuevoAccessToken });

  } catch (err) {
    // Manejo específico de errores de JWT
    return res.status(403).json({ error: "Refresh token inválido o expirado" });
  }
};*/

module.exports = {
  registrarUsuarioService,
  seleccionarUsuarioService
};