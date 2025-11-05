function normalizarCliente(datosCliente) {

  const { tipoDoc, numeroDoc, nombreCliente, direccionCliente, correoCliente } = datosCliente;

  const clienteNormalizado = {
    nombreCliente: nombreCliente.trim(),
    tipoDoc,
    numeroDoc
  };

  if(direccionCliente){
    clienteNormalizado.direccion = direccionCliente;
  }

  if (correoCliente) {
    clienteNormalizado.email = correoCliente.trim();
  }

  return clienteNormalizado;
}

module.exports = {
  normalizarCliente
};