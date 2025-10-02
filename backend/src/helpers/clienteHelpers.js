const { CLIENTE_DEFAULT } = require('../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente, tipoComprobante) {
  const esBoleta = tipoComprobante === 2;
  const esFactura = tipoComprobante === 1;

  // 🟢 Caso 1: Boleta sin cliente -> usar default
  if (esBoleta && !datosCliente) {
    return { ...CLIENTE_DEFAULT };
  }

  let { nombreCliente, tipoDoc, numeroDoc, direccion, correo } = datosCliente;

  // 🟢 Caso 2: si tipoDoc es 0, lo convertimos a "-"
  if (tipoDoc === 0) {
    tipoDoc = "-";
  }

  // 🟢 Caso 3: Validar campos obligatorios
  if (!nombreCliente || !tipoDoc || !numeroDoc) {
    const error = new Error("Se necesitan datos del cliente como tipo de documento, número de documento, nombre del cliente y direccion si es una factura");
    error.status = 400;
    throw error;
  }

  // 🟢 Caso 4: Validar que tipoDoc sea válido
  const tipoDocValido = [1, 2, 3, 4];
  if (!tipoDocValido.includes(Number(tipoDoc))) {
    const error = new Error("El tipo de documento no es válido");
    error.status = 400;
    throw error;
  }

  // 🟢 Caso 5: Validar que Factura exige RUC
  if (esFactura && Number(tipoDoc) !== 4) {
    const error = new Error("Para facturas, solo se acepta número de RUC");
    error.status = 400;
    throw error;
  }

  // 🟢 Caso 6: Validar dirección en facturas
  if (esFactura && (!direccion || direccion.trim() === "")) {
    const error = new Error("La dirección es obligatoria para facturas");
    error.status = 400;
    throw error;
  }

  // 🟢 Caso 7: Validar formato según tipoDoc
  switch (Number(tipoDoc)) {
    case 1: // DNI
      if (!/^\d{8}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El DNI debe tener exactamente 8 dígitos"), { status: 400 });
      }
      break;
    case 2: // Carné de Extranjería
      if (!/^[A-Za-z0-9]{9,12}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El Carné de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    case 3: // Pasaporte
      if (!/^[A-Za-z0-9]{6,12}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos"), { status: 400 });
      }
      break;
    case 4: // RUC
      if (!/^\d{11}$/.test(numeroDoc)) {
        throw Object.assign(new Error("El RUC debe tener exactamente 11 dígitos"), { status: 400 });
      }
      break;
  }

  // 🟢 Caso 8: Devolver objeto normalizado
  return {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc,
    direccion: direccion ? direccion.trim() : (esBoleta ? "" : null),
    email: correo ? correo.trim() : (esBoleta ? "" : null)
  };
}

module.exports = {
  normalizarCliente
};
