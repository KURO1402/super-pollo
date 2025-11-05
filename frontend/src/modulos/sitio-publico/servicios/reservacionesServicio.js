import API from "../../../app/servicio/axiosConfiguracion";

export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {
  try {
    const respuesta = await API.get('/reservaciones/mesas/disponibles', {
      params: {
        fecha,
        hora: hora + ':00'
      }
    });
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } 
    else if (respuesta.data && Array.isArray(respuesta.data.mesas)) {
      return { 
        ok: true, 
        mesas: respuesta.data.mesas 
      };
    }
    else if (Array.isArray(respuesta.data)) {
      return { 
        ok: true, 
        mesas: respuesta.data 
      };
    }
    else {
      throw new Error(respuesta.data?.mensaje || "Estructura de respuesta inesperada");
    }
  } catch (error) {
    throw error;
  }
};

export const registrarReservacionServicio = async (data) => {
  try {
    const respuesta = await API.post('/reservaciones', data);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

export const generarPreferenciaMercadoPago = async (reservationId) => {
  try {
    const respuesta = await API.post(`/reservaciones/${reservationId}/crear-preferencia`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

export const obtenerReservacionesPorUsuario = async () => {
  try {
    const respuesta = await API.get(`/reservaciones/reservas-usuario`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}