const validarCorreo = (correo) => {

  if (!correo || typeof correo !== "string") {
    throw Object.assign(new Error("El correo es necesario y debe estar en formato de texto."), { status: 400 });
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(correo)) {
    throw Object.assign(new Error("El correo electrónico no tiene un formato válido"), { status: 400 });
  }
};

const validarTelefono = (valor) => {
  // Si no hay valor (undefined, null, o string vacío) → no validar
  if (valor === undefined || valor === null || valor === "") {
    return;
  }

  // Debe ser un string válido
  if (typeof valor !== "string") {
    throw Object.assign(
      new Error("El número de teléfono deben ser números"),
      { status: 400 }
    );
  }

  const limpio = valor.replace(/\s+/g, "");

  const formatoTelefono = /^\+?\d+$/;

  if (!formatoTelefono.test(limpio)) {
    throw Object.assign(
      new Error("El número de teléfono no tiene un formato válido"),
      { status: 400 }
    );
  }
};

module.exports = { validarCorreo, validarTelefono };