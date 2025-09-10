// Funcion para validar correo electrónico tiene el formato correcto
const validarCorreo = (correo) => {
  // Expresión regular para validar correos
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Devuelve true si el correo es válido, false si no
  return regex.test(correo);
};

// Función para validar documentos según tipo numérico
const validarDocumento = (tipo, valor) => {
  const soloNumeros = /^[0-9]+$/;
  const alfanumerico = /^[a-zA-Z0-9]+$/;
  
  // Convertimos el tipo a número para evitar errores por texto
  switch (parseInt(tipo)) {
    case 1: // DNI
      // Validar que tenga exactamente 8 dígitos y que solo sean números
      return soloNumeros.test(valor) && valor.length === 8;

    case 2: // Carnet de extranjería
      // Validar que tenga exactamente 9 dígitos y que solo sean números
      return soloNumeros.test(valor) && valor.length === 9;

    case 3: // Pasaporte
      // Validar que el valor sea alfanumérico y tenga entre 8 y 12 caracteres
      return alfanumerico.test(valor) && valor.length >= 8 && valor.length <= 12;

    default:
      // Si el tipo no coincide con ninguno de los casos anteriores, retorna false
      return false;
  }
}

// Función para validar números telefónicos
const validarTelefono = (valor) => {
  const soloNumeros = /^[0-9]+$/;
  // Validar que tenga exactamente 9 dígitos y que solo sean números
  return soloNumeros.test(valor);
}

//Exportamos funciones
module.exports = { validarCorreo, validarDocumento, validarTelefono };