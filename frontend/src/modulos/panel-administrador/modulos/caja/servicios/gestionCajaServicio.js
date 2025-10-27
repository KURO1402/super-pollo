// servicios/gestionCajaServicio.js
import API from "../../../../../app/servicio/axiosConfiguracion";

// Servicio para abrir caja
export const abrirCajaServicio = async (data) => {
  try {
    const respuesta = await API.post('/caja/abrir-caja', data);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al abrir una caja");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al abrir caja:', error);
    throw error;
  }
};

// Servicio para cerrar caja
export const cerrarCajaServicio = async () => {
  try {
    const respuesta = await API.post('/caja/cerrar-caja');
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al cerrar una caja");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al cerrar caja:', error);
    throw error;
  }
};



