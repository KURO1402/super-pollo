const { validarCorreo, validarDocumento, validarTelefono } = require("../../utilidades/validaciones.js");
const { seleccionarUsuarioModel, obtenerEstadoVerificacionCorreoModel } = require("./autenticacionModelo.js");

const registrarUsuarioValidacion = async (datos) => {
  // 1️⃣ Validar que los datos existan y sean un objeto
  if (!datos || typeof datos !== 'object') {
    throw Object.assign(
      new Error("Se necesitan los datos del usuario para registrarlo."),
      { status: 400 }
    );
  }

  // 2️⃣ Definir los campos obligatorios
  const campos = [
    "nombresUsuario",
    "apellidosUsuario",
    "correoUsuario",
    "clave",
    "numeroDocumentoUsuario",
    "telefonoUsuario",
    "idTipoDocumento"
  ];

  // 3️⃣ Buscar cuáles faltan o vienen vacíos (incluyendo espacios)
  const faltantes = campos.filter(
    campo => !datos[campo] || String(datos[campo]).trim() === ""
  );

  // 4️⃣ Lanzar error si hay faltantes
  if (faltantes.length > 0) {
    throw Object.assign(
      new Error(
        `Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}`
      ),
      { status: 400 }
    );
  }

  // Validar correo
  validarCorreo(datos.correoUsuario);
  // Validar numero de documento
  validarDocumento(datos.idTipoDocumento, datos.numeroDocumentoUsuario);

  //Validar que la contraseña tenga 8 caracteres
  if (datos.clave.length < 8) {
    throw Object.assign(new Error("La contraseña debe tener al menos 8 caracteres"), { status: 400 });
  }

  // Valdar nuemro de telefono
  validarTelefono(datos.telefonoUsuario)

  //Verificar duplicado de correo (mantener comentario como recordatorio)
  const usuarioExistente = await seleccionarUsuarioModel(datos.correoUsuario);
  if (usuarioExistente.length > 0) {
    throw Object.assign(new Error("Ya existe un usuario registrado con el correo ingresado"), { status: 409 });
  };
  
  const estado = await obtenerEstadoVerificacionCorreoModel(datos.correoUsuario);

  if (!estado) {
    // No hay código generado todavía, el correo no ha recibido verificación
    throw Object.assign(
      new Error("No se ha generado un código de verificación para este correo."),
      { status: 400 }
    );
  };

  if (estado.verificado === 0) {
    throw Object.assign(new Error("El correo aún no ha sido validado. Por favor verifica tu correo."), { status: 400 });
  };
};

module.exports = {
  registrarUsuarioValidacion
}