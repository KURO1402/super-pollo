// servicios/movimientosServicios.js
import API from "../../../../../app/servicio/axiosConfiguracion";

export const crearMovimientoServicio = async (data) => {
  try {
    const respuesta = await API.post('/inventario-movimientos/registrar', data);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al registrar el movimiento");
    }
  } catch (error) {
    console.error('Error en crearMovimientoServicio:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// servicios/movimientosServicios.js
export const listarMovimientosServicio = async () => {
  try {
    const respuesta = await API.get('/inventario-movimientos');
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al listar los movimientos");
    }
    return respuesta.data.data;
  } catch (error) {
    console.error('Error al listar movimientos:', error.message);
    throw error;
  }
};

export const obtenerMovimientoIdServicio = async (id) => {
  try {
    const respuesta = await API.get(`/inventario-movimientos/${id}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el movimiento");
    }
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener el movimiento:', error.message);
    throw error;
  }
};

export const eliminarMovimientoServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/inventario-movimientos/${id}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al eliminar el movimiento");
    }
    return respuesta.data;
  } catch (error) {
    console.error('Error al eliminar el movimiento:', error.message);
    throw error;
  }
};