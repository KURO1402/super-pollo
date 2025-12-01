const { validarCorreo, validarTelefono } = require("../../utilidades/validaciones.js");

const registrarUsuarioValidacion = (datos) => {
  const lanzarError = (mensaje, status = 400) => {
    throw Object.assign(new Error(mensaje), { status });
  };

  if (!datos || typeof datos !== "object") {
    lanzarError("Se necesitan los datos del usuario para registrarlo.");
  }

  const camposObligatorios = [
    "nombresUsuario",
    "apellidosUsuario",
    "correoUsuario",
    "clave",
    "aceptoTerminos"
  ];

  const faltantes = camposObligatorios.filter(
    campo => !datos[campo] || String(datos[campo]).trim() === ""
  );

  if (faltantes.length > 0) {
    lanzarError(`Faltan los siguientes campos obligatorios: ${faltantes.join(", ")}`);
  }

  validarCorreo(datos.correoUsuario);
  
  if (datos.telefonoUsuario) {
    validarTelefono(datos.telefonoUsuario);
  }

  if (datos.clave.length < 8) {
    lanzarError("La contraseña debe tener al menos 8 caracteres.");
  }
};

module.exports = {
  registrarUsuarioValidacion
}