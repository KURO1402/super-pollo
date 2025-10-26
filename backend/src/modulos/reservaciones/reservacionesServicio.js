// importamos los modelos
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
const insertarDetalleReservacionService = async (datos) => {
  // validacion de que el idReservacion es obligatorio
  if(!datos.idReservacion || !datos.idProducto)
    // si falta algun dato se lanza el error
    throw Object.assign(new Error("Faltan datos obligatorios"), { status: 400 });
    // si todo esta bien se llama al modelo para ejecutar el procedimiento
    return await insertarDetalleReservacionModel(datos);
} 

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
}