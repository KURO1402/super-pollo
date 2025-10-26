const { validarCorreo, validarDocumento, validarTelefono } = require("../../utilidades/validaciones.js");

const registrarUsuarioValidacion = async (datos) => {
  const lanzarError = (mensaje, status = 400) => {
    throw Object.assign(new Error(mensaje), { status });
  };

  // Validar estructura del objeto
  if (!datos || typeof datos !== "object") {
    lanzarError("Se necesitan los datos del usuario para registrarlo.");
  }

  // Campos obligatorios
  const camposObligatorios = [
    "nombresUsuario",
    "apellidosUsuario",
    "correoUsuario",
    "clave",
    "numeroDocumentoUsuario",
    "telefonoUsuario",
    "idTipoDocumento"
  ];

  const faltantes = camposObligatorios.filter(
    campo => !datos[campo] || String(datos[campo]).trim() === ""
  );

  if (faltantes.length > 0) {
    lanzarError(`Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}`);
  }

  //  Validaciones específicas
  validarCorreo(datos.correoUsuario);
  validarDocumento(datos.idTipoDocumento, datos.numeroDocumentoUsuario);
  validarTelefono(datos.telefonoUsuario);

  // Contraseña mínima
  if (datos.clave.length < 8) {
    lanzarError("La contraseña debe tener al menos 8 caracteres.");
  }
};

module.exports = {
  registrarUsuarioValidacion
}