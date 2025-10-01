const { CLIENTE_DEFAULT } = require('../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente, tipoComprobante) {
  const esBoleta = tipoComprobante === 1;

  // 🟢 Caso 1: Boleta sin cliente -> usar default
  if (esBoleta && !datosCliente) {
    return { ...CLIENTE_DEFAULT };
  }

  // 🟢 Caso 2: Para facturas y demás comprobantes, cliente es obligatorio
  if (!datosCliente) {
    const error = new Error("El objeto cliente es obligatorio para este tipo de comprobante");
    error.status = 400;
    throw error;
  }

  const { nombreCliente, tipoDoc, numeroDoc, direccion, correo } = datosCliente;

  // 🟢 Caso 3: Validar campos obligatorios
  if (!nombreCliente || !tipoDoc || !numeroDoc) {
    const error = new Error("El cliente debe tener nombreCliente, tipoDoc y numeroDoc");
    error.status = 400;
    throw error;
  }

  // 🟢 Caso 4: Validar formato según tipoDoc
  switch (Number(tipoDoc)) {
    case 1: // DNI
      if (!/^\d{8}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El DNI debe tener exactamente 8 dígitos"), { status: 400 });
      }
      break;
    case 4: // RUC
      if (!/^\d{11}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El RUC debe tener exactamente 11 dígitos"), { status: 400 });
      }
      break;
    case 6: // Carné de Extranjería
      if (!/^[A-Za-z0-9]{9,12}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El Carné de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    case 7: // Pasaporte
      if (!/^[A-Za-z0-9]{6,12}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    default:
      throw Object.assign(new Error("El tipo de documento no es válido"), { status: 400 });
  }

  // 🟢 Caso 5: Devolver objeto normalizado con opcionales
  return {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc,
    cliente_direccion: direccion ? direccion.trim() : null,
    cliente_email: correo ? correo.trim() : null
  };
}

module.exports = {
  normalizarCliente
};
