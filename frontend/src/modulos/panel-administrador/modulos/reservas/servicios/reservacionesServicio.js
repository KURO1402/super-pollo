import API from "../../../../../app/servicio/axiosConfiguracion";

export const listarReservacionesServicio = async () => {
  try {
    const respuesta = await API.get('/reservaciones');
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data.reservaciones || [];
    } 
    else if (respuesta.data && Array.isArray(respuesta.data.reservaciones)) {
      return respuesta.data.reservaciones;
    }
    else if (Array.isArray(respuesta.data)) {
      return respuesta.data;
    }
    else {
      throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
    }
  } catch (error) {
    throw error;
  }
};

export const crearReservacionServicio = async (datosReservacion) => {
  try {
    const respuesta = await API.post('/reservaciones', datosReservacion);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear reservación");
    }
  } catch (error) {

    throw error;
  }
};

export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {

  try {
    const respuesta = await API.get('/reservaciones/mesas/disponibles', {
      params: { fecha, hora }
    });

    if (respuesta.data?.ok && Array.isArray(respuesta.data.mesas)) {
      return { ok: true, mesas: respuesta.data.mesas };
    }

    throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
  } catch (error) {
    throw error;
  }
};

export const obtenerReservacionPorIdServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener reservación");
    }
  } catch (error) {
    throw error;
  }
};

export const obtenerDetalleReservacionServicio = async (idReservacion) => {
  try {
    const respuesta = await API.get(`/reservaciones/${idReservacion}/detalle`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener detalle de reservación");
    }
  } catch (error) {
    throw error;
  }
};

export const actualizarReservacionServicio = async (idReservacion, datosActualizados) => {
  try {
    const respuesta = await API.put(`/reservaciones/${idReservacion}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar reservación");
    }
  } catch (error) {
    throw error;
  }
};