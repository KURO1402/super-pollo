// servicios/reservaServicio.js
import API from "../../../app/servicio/axiosConfiguracion";

export const obtenerMesasDisponiblesServicio = async (fecha, hora) => {
  try {
    const respuesta = await API.get('/reservaciones/mesas/disponibles', {
      params: {
        fecha,
        hora: hora + ':00'
      }
    });
    
    // Verificar diferentes estructuras posibles
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } 
    // Si la respuesta tiene mesas directamente
    else if (respuesta.data && Array.isArray(respuesta.data.mesas)) {
      return { 
        ok: true, 
        mesas: respuesta.data.mesas 
      };
    }
    // Si la respuesta es el array directamente
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
    console.error('Error en obtenerMesasDisponiblesServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const registrarReservacionServicio = async (data) => {
  try {
    const respuesta = await API.post('/reservaciones', data);
    return respuesta.data;
  } catch (error) {
    console.error("Error en registrarReservaServicio: ", error);
    throw error;
  }
}

export const generarPreferenciaMercadoPago = async (reservationId) => {
  try {
    const respuesta = await API.post(`/reservaciones/${reservationId}/crear-preferencia`);
    console.log("Preferencia generada:", respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error("Error en generarPreferenciaMercadoPago: ", error);
    throw error;
  }
}