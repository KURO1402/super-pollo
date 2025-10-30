// Funcion para validar correo electrónico tiene el formato correcto
const validarCorreo = (correo) => {

  if (!correo || typeof correo !== "string") {
    throw Object.assign(new Error("El correo es necesario y debe estar en formato de texto."), { status: 400 });
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    throw Object.assign(new Error("El correo electrónico no tiene un formato válido"), { status: 400 });
  }
};

// Función para validar documentos según tipo numérico
const validarDocumento = (tipo, valor) => {
  switch (Number(tipo)) {
    case 0: // CLIENTES VARIOS ES DNI
      if (!/^\d{8}$/.test(valor)) {
        throw Object.assign(new Error("El numero de documento debe tener exactamente 8 dígitos"), { status: 400 });
      }
      break;
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
  if (!valor) {
    throw Object.assign(new Error("El número de teléfono es obligatorio"), { status: 400 });
  }
  // Quitar espacios en blanco
  const limpio = valor.replace(/\s+/g, "");
  // Validar que tenga números y opcionalmente un + al inicio
  const formatoTelefono = /^\+?\d+$/;
  if (!formatoTelefono.test(limpio)) {
    throw Object.assign(new Error("El número de teléfono no tiene un formato válido"), { status: 400 });
  }
}



//Exportamos funciones
module.exports = { validarCorreo, validarDocumento, validarTelefono };