const { CLIENTE_DEFAULT } = require('../../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente, tipoComprobante) {

  // Boleta sin cliente -> usar default
  if (tipoComprobante === 2 && !datosCliente) {
    return { ...CLIENTE_DEFAULT };
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccion, correo } = datosClient;

  return {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc,
    direccion: direccion ? direccion.trim() : "-",
    email: correo ? correo.trim() : "-"
  };
}

module.exports = {
  normalizarCliente
};
