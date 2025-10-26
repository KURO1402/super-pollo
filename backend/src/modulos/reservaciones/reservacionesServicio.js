/*// importamos los modelos
const {
  insertarReservacionModel,
  listarReservacionesModel,
  obtenerReservacionModel,
  actualizarReservacionModel,
  insertarPagoModel,
  actualizarPagoModel,
  obtenerPagoModel,
  insertarDetalleReservacionModel,
  obtenerDetalleReservacionModel,
  listarMesasDisponiblesModel
} = require("./reservacionesModelo.js");

// servicio para insertar reservacion
const insertarReservacionService = async (datos) => {
  // validacion de que no falten datos
  if (!datos.fechaReservacion || !datos.horaReservacion || !datos.cantidadPersonas || !datos.idUsuario || !datos.idMesa) {
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
  }
  // si todo esta bien se llama al modelo para ejecutar el procedimiento
  return await insertarReservacionModel(datos);
}

// servicio para listar reservaciones
const listarReservacionesService = async (pagina) => { // se recibe el numero de pagina
  // si no se recibe numero de pagina, devuelve la pagina 1 
  return await listarReservacionesModel(pagina || 1);  
}

// servicio para obtener una reservacion por id
const obtenerReservacionService = async (idReservacion) => {
  // validacion de que el idReservacion es obligatorio
  if (!idReservacion)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await obtenerReservacionModel(idReservacion);
}

//servicio para actualizar una reservacion
const actualizarReservacionService = async (datos) => {
  // validacion de que el idReservacion es obligatorio
  if(!datos.idReservacion)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await actualizarReservacionModel(datos);
}

//servicio para insertar el pago de una reservacion
const insertarPagoService = async (datos) => {
  // validacion de que el idReservacion es obligatorio
  if(!datos.idReservacion)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await insertarPagoModel(datos);
}    
//servicio para actualizar el pago de una reservacion
const actualizarPagoService = async ({ idTransaccion, estadoPago }) => {
  if (!idTransaccion || !estadoPago)
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
  return await actualizarPagoModel({ idTransaccion, estadoPago });
};

//servicio para obtener pago por id de reservacion
const obtenerPagoService = async (idReservacion) => {
  // validacion de que el idReservacion es obligatorio
  if(!idReservacion)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await obtenerPagoModel(idReservacion);
}    

//servicio para insertar detalle de reservacion
const insertarDetalleReservacionService = async (data) => {
  if (Array.isArray(data.productos)) {
    // Caso: se envía una lista de productos
    for (const producto of data.productos) {
      await insertarDetalleReservacionModel({
        cantidadProductoReservacion: producto.cantidadProductoReservacion,
        precioUnitario: producto.precioUnitario,
        idReservacion: data.idReservacion,
        idProducto: producto.idProducto
      });
    }
    return { mensaje: "Detalles de reservación registrados correctamente" };
  } else {
    // Caso: se envía un solo producto 
    await insertarDetalleReservacionModel(data);
    return { mensaje: "Detalle de reservación registrado correctamente" };
  }
};

//servicio para obtener detalle de reservacion por id
const obtenerDetalleReservacionService = async (idReservacion) => {
  // validacion de que no falten datos
  if(!idReservacion)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await obtenerDetalleReservacionModel(idReservacion);
}    

// servicio para mostrar mesas disponibles por fecha y hora
const listarMesasDisponiblesService = async (fechaReservacion, horaReservacion) => {
  if (!fechaReservacion || !horaReservacion)
    throw Object.assign(new Error("Falta la fecha o hora de reservación"), { status: 400 });

  return await listarMesasDisponiblesModel(fechaReservacion, horaReservacion);
}; 

// exportamos los modulos
module.exports = {
  insertarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  actualizarPagoService,
  obtenerPagoService,
  insertarDetalleReservacionService,
  obtenerDetalleReservacionService,
  listarMesasDisponiblesService
}*/

// Importar modelos y validaciones
const {
  insertarReservacionModel,
  listarReservacionesModel,
  obtenerReservacionModel,
  actualizarReservacionModel,
  insertarPagoModel,
  actualizarPagoModel,
  obtenerPagoModel,
  insertarDetalleReservacionModel,
  obtenerDetalleReservacionModel,
  listarMesasDisponiblesModel
} = require("./reservacionesModelo.js");

const {
  validarDatosReservacion,
  validarDetalleReservacion,
  validarActualizacionPago,
  validarConsultaMesasDisponibles
} = require("./reservacionesValidaciones.js");

// Servicios de Reservaciones

// Crear una nueva reservación
const insertarReservacionService = async (datos) => {
  await validarDatosReservacion(datos);
  const resultado = await insertarReservacionModel(datos);

  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo registrar la reservación"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Reservación registrada correctamente",
  };
};

// Listar reservaciones con paginación
const listarReservacionesService = async (pagina = 1) => {
  const reservaciones = await listarReservacionesModel(pagina);
  if (!reservaciones || reservaciones.length === 0) {
    throw Object.assign(new Error("No se encontraron reservaciones"), { status: 404 });
  }
  return reservaciones;
};

// Obtener una reservación por su ID
const obtenerReservacionService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("El idReservacion es obligatorio"), { status: 400 });
  }

  const reservacion = await obtenerReservacionModel(idReservacion);
  if (!reservacion || reservacion.length === 0) {
    throw Object.assign(new Error("No se encontró la reservación"), { status: 404 });
  }

  return reservacion;
};

// Actualizar datos de una reservación
const actualizarReservacionService = async (datos) => {
  if (!datos.idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const resultado = await actualizarReservacionModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo actualizar la reservación"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Reservación actualizada correctamente",
  };
};

// Servicios de Pago

// Insertar pago de una reservación
const insertarPagoService = async (datos) => {
  if (!datos.idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const resultado = await insertarPagoModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo registrar el pago"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Pago registrado correctamente",
  };
};

// Actualizar el estado del pago (por ejemplo, pagado, rechazado, etc.)
const actualizarPagoService = async (datos) => {
  await validarActualizacionPago(datos);

  const resultado = await actualizarPagoModel(datos);
  if (!resultado || resultado.affectedRows === 0) {
    throw Object.assign(new Error("No se pudo actualizar el estado del pago"), { status: 500 });
  }

  return {
    ok: true,
    mensaje: "Estado del pago actualizado correctamente",
  };
};

// Obtener información del pago asociado a una reservación
const obtenerPagoService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const pago = await obtenerPagoModel(idReservacion);
  if (!pago || pago.length === 0) {
    throw Object.assign(new Error("No se encontró el pago"), { status: 404 });
  }

  return pago;
};

// Servicios de Detalle de Reservación

// Insertar uno o varios productos asociados a una reservación
const insertarDetalleReservacionService = async (data) => {
  await validarDetalleReservacion(data.productos || data);

  if (Array.isArray(data.productos)) {
    for (const producto of data.productos) {
      await insertarDetalleReservacionModel({
        cantidadProductoReservacion: producto.cantidadProductoReservacion,
        precioUnitario: producto.precioUnitario,
        idReservacion: data.idReservacion,
        idProducto: producto.idProducto
      });
    }
    return { ok: true, mensaje: "Detalles de reservación registrados correctamente" };
  } else {
    await insertarDetalleReservacionModel(data);
    return { ok: true, mensaje: "Detalle de reservación registrado correctamente" };
  }
};

// Obtener los detalles de una reservación específica
const obtenerDetalleReservacionService = async (idReservacion) => {
  if (!idReservacion) {
    throw Object.assign(new Error("Falta el idReservacion"), { status: 400 });
  }

  const detalles = await obtenerDetalleReservacionModel(idReservacion);
  if (!detalles || detalles.length === 0) {
    throw Object.assign(new Error("No se encontraron detalles para esta reservación"), { status: 404 });
  }

  return detalles;
};

// Servicio para listar mesas disponibles
const listarMesasDisponiblesService = async (fechaReservacion, horaReservacion) => {
  await validarConsultaMesasDisponibles(fechaReservacion, horaReservacion);

  const mesas = await listarMesasDisponiblesModel(fechaReservacion, horaReservacion);
  if (!mesas || mesas.length === 0) {
    throw Object.assign(new Error("No hay mesas disponibles en esa fecha y hora"), { status: 404 });
  }

  return mesas;
};

// Exportar servicios
module.exports = {
  insertarReservacionService,
  listarReservacionesService,
  obtenerReservacionService,
  actualizarReservacionService,
  insertarPagoService,
  actualizarPagoService,
  obtenerPagoService,
  insertarDetalleReservacionService,
  obtenerDetalleReservacionService,
  listarMesasDisponiblesService
};
