// src/pages/reservas/servicios/reservacionesServicio.js

import API from "../../../../../app/servicio/axiosConfiguracion";

// Servicio para listar todas las reservaciones
export const listarReservacionesServicio = async () => {
  try {
    const respuesta = await API.get('/reservaciones');
    
    // Verificar diferentes estructuras posibles
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.reservaciones || [];
    } 
    // Si la respuesta tiene reservaciones directamente
    else if (respuesta.data && Array.isArray(respuesta.data.reservaciones)) {
      return respuesta.data.reservaciones;
    }
    // Si la respuesta es el array directamente
    else if (Array.isArray(respuesta.data)) {
      return respuesta.data;
    }
    else {
      throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
    }
  } catch (error) {
    console.error('Error en listarReservacionesServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para crear una nueva reservación
export const crearReservacionServicio = async (datosReservacion) => {
  try {
    const respuesta = await API.post('/reservaciones', datosReservacion);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear reservación");
    }
  } catch (error) {
    console.error('Error en crearReservacionServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para obtener mesas disponibles
export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {

  try {
    const respuesta = await API.get('/reservaciones/mesas/disponibles', {
      params: { fecha, hora }
    });

    // Verificar si la respuesta contiene las mesas
    if (respuesta.data?.ok && Array.isArray(respuesta.data.mesas)) {
      return { ok: true, mesas: respuesta.data.mesas };
    }

    // Si no tiene el formato esperado, lanzar error
    throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
  } catch (error) {
    console.error('Error en obtenerMesasDisponiblesServicio:', error);
    throw error;
  }
};


// Servicio para obtener una reservación por ID
export const obtenerReservacionPorIdServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener reservación");
    }
  } catch (error) {
    console.error('Error en obtenerReservacionPorIdServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para obtener el detalle de una reservación
export const obtenerDetalleReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}/detalle`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener detalle de reservación");
    }
  } catch (error) {
    console.error('Error en obtenerDetalleReservacionServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para obtener el pago de una reservación
export const obtenerPagoReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}/pago`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener pago de reservación");
    }
  } catch (error) {
    console.error('Error en obtenerPagoReservacionServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para actualizar una reservación
export const actualizarReservacionServicio = async (idReservacion, datosActualizados) => {
  try {
    const respuesta = await API.put(`/reservaciones/${idReservacion}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar reservación");
    }
  } catch (error) {
    console.error('Error en actualizarReservacionServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para cancelar una reservación (simulado ya que no existe en el backend)
export const cancelarReservacionServicio = async (idReservacion) => {
  try {
    // Como no hay endpoint específico para cancelar, usamos el de actualización
    const respuesta = await API.put(`/reservaciones/${idReservacion}`, {
      estadoReservacion: 'cancelado'
    });
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al cancelar reservación");
    }
  } catch (error) {
    console.error('Error en cancelarReservacionServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};