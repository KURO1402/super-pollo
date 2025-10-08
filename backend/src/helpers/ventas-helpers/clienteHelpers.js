const { CLIENTE_DEFAULT } = require('../../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente, tipoComprobante) {

  // Boleta sin cliente -> usar default
  if (tipoComprobante === 2 && !datosCliente) {
    return { ...CLIENTE_DEFAULT };
  }

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;

  // Crear el objeto base
  const clienteNormalizado = {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc,
    direccion: direccionCliente ? direccionCliente.trim() : "-"
  };

  // Solo agregar el email si existe y no está vacío
  if (correoCliente && correoCliente.trim() !== "") {
    clienteNormalizado.email = correoCliente.trim();
  }

  return clienteNormalizado;
}

module.exports = {
  normalizarCliente
};