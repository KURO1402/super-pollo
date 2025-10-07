// Funcion para validar correo electrónico tiene el formato correcto
const validarCorreo = (correo) => {
  if (!correo) return false;
  // Expresión regular para validar correos
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Devuelve true si el correo es válido, false si no
  return regex.test(correo);
};

// Función para validar documentos según tipo numérico
const validarDocumento = (tipo, valor) => {
  switch (Number(tipo)) {
    case 1: // DNI
      if (!/^\d{8}$/.test(valor)) {
        throw Object.assign(new Error("El DNI debe tener exactamente 8 dígitos"), { status: 400 });
      }
      break;
    case 2: // Carné de Extranjería
      if (!/^[A-Za-z0-9]{9,12}$/.test(valor)) {
        throw Object.assign(new Error("El Carné de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    case 3: // Pasaporte
      if (!/^[A-Za-z0-9]{6,12}$/.test(valor)) {
        throw Object.assign(new Error("El Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    case 4: // RUC
      if (!/^\d{11}$/.test(valor)) {
        throw Object.assign(new Error("El RUC debe tener exactamente 11 dígitos"), { status: 400 });
      }
      break;
    default:
      throw Object.assign(new Error("Tipo de documento no válido"), { status: 400 });
  }
}

// Función para validar números telefónicos
const validarTelefono = (valor) => {
  if (!valor) return false;
  // Quitar espacios en blanco
  const limpio = valor.replace(/\s+/g, "");
  // Validar que tenga numeros y opcionalmente un + al inicio
  const formatoTelefono = /^\+?\d+$/;
  return formatoTelefono.test(limpio);
}



//Exportamos funciones
module.exports = { validarCorreo, validarDocumento, validarTelefono };