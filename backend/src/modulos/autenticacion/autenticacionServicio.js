require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validarCorreo, validarDocumento, validarTelefono } = require("../../utilidades/validaciones");
const { insertarUsuarioModel, seleccionarUsuarioModel } = require("./autenticacionModelo");

// FUNCION PARA REGISTRAR USUARIO
const registrarUsuarioService = async (datos) => {
  //Desestructuración de el objeto recibido por el frontend
  const {
    nombresUsuario,
    apellidosUsuario,
    correoUsuario,
    clave,
    idTipoDocumento,
    numeroDocumentoUsuario,
    telefonoUsuario
  } = datos;

  //Creamos un array para los campos obligatorios 
  const camposObligatorios = [
    nombresUsuario, 
    apellidosUsuario, 
    correoUsuario, 
    clave, 
    numeroDocumentoUsuario, 
    telefonoUsuario, 
    idTipoDocumento
  ];
  
  //Usamos el metodo some que verifica que todos los campos tengan un valor y si encuentra algo que no cumple lanza true y entra a crear un error
  if (camposObligatorios.some(campo => !campo)) {
    //Creamos el error
    const error = new Error("Faltan datos obligatorios");
    //Asiganmos una nueva propiedad al error
    error.status = 400;
    //lanzamos el error
    throw error;
  }

  // Validaciones para cada caso especifico, todos estos casos se hace lo mismo al crear el error(crear, asignar valor y lanzar error) solo que aca esta en una linea
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

  //Verificar duplicado de correo (mantener comentario como recordatorio)
  const usuarioExistente = await seleccionarUsuarioModel(correoUsuario);
  if (usuarioExistente.length > 0) {
    throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado"), { status: 409 });
  }

  //Encriptar la contraseña - costo de hashing configurado según rendimiento/seguridad(en este caso 10)
  const claveEncriptada = await bcrypt.hash(clave, 10);

  //Insertar usuario en la BD mediante el modelo creado
  const nuevoUsuario = await insertarUsuarioModel(datos, claveEncriptada);
  
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

//FUNCION PARA INICIAR SESION
const seleccionarUsuarioService = async ({ email, clave }) => {
  //Array de campos obligatorios igual que el de registra usuario
  const camposObligatorios = [email, clave];

  //Verificar los campos con some igual que en la de registrar usuario
  if (camposObligatorios.some(campo => !campo)) {
    //Lanzar error para el controlador
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
  }
  //Llamamos al modelo que interactua con la BD para traer al usuario
  const resultado = await seleccionarUsuarioModel(email);

  //Verificamos que el modelo nos ha devuelto un usuario
  if(resultado.length == 0){
    //Lanzamos un error para el catch del controlador
    throw Object.assign(new Error("Credenciales de acceso invalidas"), {status: 401});
  }

  //Guaradamos el usuario en una constante
  const usuario = resultado[0];

  // Verificar contraseña con bcrypt (retorna true si las claves coinciden)
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave);

  //Si es false es decir que las contraseñas no coinciden
  if(!contraseñaValida){
    //Lanzamos error
    throw Object.assign(new Error("Credenciales de acceso invalidas"), {status: 401});
  }

  // Creamos un objeto con los datos necesarios del usuario para el token y enviar al forntend
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
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "20m" }
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
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) reject(err);// Si hay error (token inválido o expirado) rechazamos la promesa
      else resolve(decoded);// Si todo está bien, resolvemos la promesa con los datos decodificados del usuario
    });
  });

  // Generamos un nuevo accessToken válido por 15 minutos
  const nuevoAccessToken = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  //Devolvemos el nuevo accestoken para el controlador
  return nuevoAccessToken;
};

//Exportamos modulo
module.exports = {
  registrarUsuarioService,
  seleccionarUsuarioService,
  renovarAccessTokenService
};