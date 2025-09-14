// Funcion para validar correo electrónico tiene el formato correcto
const validarCorreo = (correo) => {
  // Expresión regular para validar correos
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Devuelve true si el correo es válido, false si no
  return regex.test(correo);
};

// Función para validar documentos según tipo numérico
const validarDocumento = (tipo, valor) => {
  const soloNumeros = /^[0-9]+$/;
  const alfanumerico = /^[a-zA-Z0-9]+$/;
  
  // Convertimos el tipo a número para evitar errores por texto
  switch (parseInt(tipo)) {
    case 1: // DNI
      // Validar que tenga exactamente 8 dígitos y que solo sean números
      return soloNumeros.test(valor) && valor.length === 8;

    case 2: // Carnet de extranjería
      // Validar que tenga exactamente 9 dígitos y que solo sean números
      return soloNumeros.test(valor) && valor.length === 9;

    case 3: // Pasaporte
      // Validar que el valor sea alfanumérico y tenga entre 8 y 12 caracteres
      return alfanumerico.test(valor) && valor.length >= 8 && valor.length <= 12;

    default:
      // Si el tipo no coincide con ninguno de los casos anteriores, retorna false
      return false;
  }
}

// Función para validar números telefónicos
const validarTelefono = (valor) => {
  const soloNumeros = /^[0-9]+$/;
  // Validar que tenga exactamente 9 dígitos y que solo sean números
  return soloNumeros.test(valor);
}

//Validaciones apra al venta
// Validar si es número positivo
const validarNumeroPositivo = (valor) => {
  return typeof valor === "number" && valor >= 0;
};

// Validar fechas (YYYY-MM-DD)
const validarFecha = (valor) => {
  return !isNaN(Date.parse(valor));
};

// Validar texto con límite
const validarTexto = (valor, max) => {
  return typeof valor === "string" && valor.trim() !== "" && valor.length <= max;
};

// Validar enteros positivos
const validarEntero = (valor) => {
  return Number.isInteger(valor) && valor > 0;
};

// Validar campos de venta según la BD
const validarVenta = (venta) => {
  if (!validarTexto(venta.numeroDocumentoCliente, 12)) return "Documento cliente inválido";
  if (!validarTexto(venta.serie, 5)) return "Serie inválida";
  //if (!validarEntero(venta.numeroCorrelativo)) return "Número correlativo inválido";
  //if (venta.sunatTransaccion !== 0 && venta.sunatTransaccion !== 1) return "Transacción Sunat inválida";
  if (!validarFecha(venta.fechaEmision)) return "Fecha de emisión inválida";
  if (venta.fechaVencimiento && !validarFecha(venta.fechaVencimiento)) return "Fecha de vencimiento inválida";
  if (!validarNumeroPositivo(venta.porcentajeIGV)) return "Porcentaje IGV inválido";
  if (!validarNumeroPositivo(venta.totalGravada)) return "Total gravada inválido";
  if (!validarNumeroPositivo(venta.totalIGV)) return "Total IGV inválido";
  if (!validarNumeroPositivo(venta.totalVenta) || venta.totalVenta === 0) return "Total venta inválido";
  if (venta.aceptadaPorSunat !== 0 && venta.aceptadaPorSunat !== 1) return "Aceptada por Sunat inválida";
  //if (!validarFecha(venta.fechaRegistro)) return "Fecha de registro inválida";
  if (venta.urlCombrobantePDF && !validarTexto(venta.urlCombrobantePDF, 100)) return "URL PDF inválida";
  if (venta.urlCombrobanteXML && !validarTexto(venta.urlCombrobanteXML, 100)) return "URL XML inválida";
  if (venta.idMedioPago && !validarEntero(venta.idMedioPago)) return "Medio de pago inválido";
  if (venta.idTipoComprobante && !validarEntero(venta.idTipoComprobante)) return "Tipo comprobante inválido";
  return null; //  todo bien
};

//Exportamos funciones
module.exports = { validarCorreo, validarDocumento, validarTelefono, validarNumeroPositivo, validarFecha, validarEntero, validarTexto, validarVenta };