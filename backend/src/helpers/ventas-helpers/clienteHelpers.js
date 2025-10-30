const { CLIENTE_DEFAULT } = require('../../config/constantes');

// Normalizar cliente según reglas de negocio
function normalizarCliente(datosCliente) {

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;

  // Crear el objeto base
  const clienteNormalizado = {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc
  };

  if(direccionCliente){
    clienteNormalizado.direccion = direccionCliente;
  }

  // Solo agregar el email si existe y no está vacío
  if (correoCliente) {
    clienteNormalizado.email = correoCliente.trim();
  }

  return clienteNormalizado;
}

module.exports = {
  normalizarCliente
};