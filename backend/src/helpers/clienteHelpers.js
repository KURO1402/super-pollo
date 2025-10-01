const { consultarDNI } = require("../servicios/consultarDNI");
const { CLIENTE_DEFAULT, MONTO_MINIMO_DOCUMENTO, TIPOS_COMPROBANTE } = require('../config/constantes');

// Validar datos obligatorios para factura
function validarDatosFactura(cliente, tipoComprobante) {
  const esFactura = tipoComprobante === TIPOS_COMPROBANTE.FACTURA;
  
  if (esFactura) {
    if (!cliente || !cliente.tipoDoc || !cliente.numeroDoc) {
      const error = new Error('Para facturas es obligatorio enviar tipoDoc y numeroDoc del cliente');
      error.status = 400;
      throw error;
    }
    
    // Validar formato del RUC
    if (!cliente.numeroDoc || cliente.numeroDoc.length !== 11) {
      const error = new Error('El RUC debe tener 11 dígitos');
      error.status = 400;
      throw error;
    }
  }
}

// Validar que si el monto es mayor a 700, debe tener datos del cliente
function validarMontoAltoRequiereCliente(cliente, montoTotal, tipoComprobante) {
  const esFactura = tipoComprobante === TIPOS_COMPROBANTE.FACTURA;
  
  // Si no es factura y el monto es mayor a 700, requiere datos del cliente
  if (!esFactura && montoTotal >= MONTO_MINIMO_DOCUMENTO) {
    if (!cliente || !cliente.tipoDoc || !cliente.numeroDoc) {
      const error = new Error(`Para montos mayores o iguales a S/.${MONTO_MINIMO_DOCUMENTO} es obligatorio enviar datos del cliente (tipoDoc y numeroDoc)`);
      error.status = 400;
      throw error;
    }
    
    // Validar formato del DNI
    if (!cliente.numeroDoc || cliente.numeroDoc.length !== 8) {
      const error = new Error('El DNI debe tener 8 dígitos');
      error.status = 400;
      throw error;
    }
  }
}

// Determinar si se debe usar "Consumidor final"
function debeUsarConsumidorFinal(cliente, montoTotal, esFactura) {
  return (
    (!cliente.tipoDoc || !cliente.numeroDoc) &&
    montoTotal < MONTO_MINIMO_DOCUMENTO &&
    !esFactura
  );
}

// Consultar nombre desde API de DNI
async function obtenerNombreDesdeDNI(cliente) {
  try {
    const datosAPI = await consultarDNI(cliente.numeroDoc);
    
    if (datosAPI && datosAPI.nombres) {
      return {
        ...cliente,
        nombreCliente: `${datosAPI.apellidoPaterno} ${datosAPI.apellidoMaterno} ${datosAPI.nombres}`.trim()
      };
    }
  } catch (error) {
    console.error("Error al consultar el DNI:", error.message);
    // En caso de error, mantener los datos originales
  }

  return cliente;
}

// Normalizar datos del cliente según reglas de negocio
async function normalizarCliente(datosCliente, montoTotal, tipoComprobante) {
  const cliente = datosCliente || {};
  const esFactura = tipoComprobante === TIPOS_COMPROBANTE.FACTURA;

  // 👇 PRIMERO validar datos obligatorios para factura
  validarDatosFactura(cliente, tipoComprobante);

  // 👇 VALIDAR que si el monto es alto, requiere datos del cliente
  validarMontoAltoRequiereCliente(cliente, montoTotal, tipoComprobante);

  // Si es factura (siempre RUC), mantener los datos tal cual vienen
  if (esFactura) {
    return cliente;
  }

  // Si existe un tipo de doc
  if (cliente.numeroDoc) {
    return await obtenerNombreDesdeDNI(cliente);
  }

  // Para boletas con monto bajo, aplicar regla de consumidor final
  if (debeUsarConsumidorFinal(cliente, montoTotal, esFactura)) {
    return { ...CLIENTE_DEFAULT };
  }

  return cliente;
}

module.exports = {
  normalizarCliente,
  debeUsarConsumidorFinal,
  obtenerNombreDesdeDNI,
  validarDatosFactura,
  validarMontoAltoRequiereCliente
};