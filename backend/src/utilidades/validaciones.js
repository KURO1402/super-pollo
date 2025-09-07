// Funcion para validar correo electrónico
const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

//Exportamos funciones
module.exports = { validarCorreo };