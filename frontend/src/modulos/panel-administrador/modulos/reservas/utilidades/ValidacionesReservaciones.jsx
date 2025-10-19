// src/validations/validacionesReservas.js

/**
 * Validaciones de lógica de negocio para reservas
 */

// Validar disponibilidad de mesa
export const validarDisponibilidadMesa = (
  reservas,
  fechaReserva,
  horaReserva,
  numeroMesa,
  reservaActualId = null
) => {
  return !reservas.some(
    (r) =>
      r.numeroMesa === Number(numeroMesa) &&
      r.fechaReserva === fechaReserva &&
      r.horaReserva === horaReserva &&
      r.estado !== "cancelado" &&
      r.id !== reservaActualId
  );
};

// Validar capacidad de la mesa
export const validarCapacidadMesa = (numeroMesa, cantidadPersonas, configuracionMesas) => {
  const mesa = configuracionMesas.mesas.find(m => m.numero === Number(numeroMesa));
  if (!mesa) return false;
  
  return Number(cantidadPersonas) <= mesa.capacidad;
};

// Convertir datos de reserva al formato de FullCalendar
export const convertirReservaAEvento = (reserva) => {
  return {
    id: reserva.id,
    title: `${reserva.nombreCliente} (Mesa ${reserva.numeroMesa})`,
    start: reserva.fechaReserva,
    allDay: true,
    extendedProps: {
      cliente: reserva.nombreCliente,
      mesa: reserva.numeroMesa,
      cantidad: reserva.cantidadPersonas,
      hora: reserva.horaReserva,
      estado: reserva.estado,
      telefono: reserva.telefono || "",
      comentarios: reserva.comentarios || "",
    },
  };
};