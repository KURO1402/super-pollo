const { CLIENTE_DEFAULT } = require('../../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente, tipoComprobante) {

  // Boleta sin cliente -> usar default
  if (tipoComprobante === 2 && !datosCliente) {
    return { ...CLIENTE_DEFAULT };
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;

  return {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc,
    direccion: direccionCliente ? direccionCliente.trim() : "-",
    email: correoCliente ? correoCliente.trim() : "-"
  };
}

module.exports = {
  normalizarCliente
};
