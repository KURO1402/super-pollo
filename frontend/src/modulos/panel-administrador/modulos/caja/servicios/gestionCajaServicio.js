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

// Servicio para registrar ingreso
export const registrarIngresoServicio = async (data) => {
  try {
    const datosParaBackend = {
      monto: data.monto,
      descripcion: data.descripcion,
      tipoMovimiento: "Ingreso",
      descripcionMovCaja: data.descripcion
    };
    
    const respuesta = await API.post('/caja/ingreso-caja', datosParaBackend);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar ingreso");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    throw error;
  }
};

// Servicio para registrar egreso
export const registrarEgresoServicio = async (data) => {
  try {
    const datosParaBackend = {
      monto: data.monto,
      descripcion: data.descripcion,
      tipoMovimiento: "Egreso", 
      descripcionMovCaja: data.descripcion
    };
    
    const respuesta = await API.post('/caja/egreso-caja', datosParaBackend);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar egreso");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al registrar egreso:', error);
    throw error;
  }
};

// Servicio para registrar arqueo
export const registrarArqueoServicio = async (data) => {
  try {
    const respuesta = await API.post('/caja/arqueo-caja', data);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al registrar arqueo");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al registrar arqueo:', error);
    throw error;
  }
};

// Servicio para obtener movimientos de caja
export const obtenerMovimientosCajaServicio = async () => {
  try {
    const respuesta = await API.get('/caja/movimientos-caja');
    
    const movimientosData = respuesta.data;
    
    // Validar que sea un array
    if (Array.isArray(movimientosData)) {
      // Mapear a la estructura
      const movimientosFormateados = movimientosData.map(mov => ({
        id: mov.id || Date.now() + Math.random(), // generamos un id temporal ya que no viene del backend
        tipo: mov.tipoMovimiento?.toLowerCase() || 'ingreso',
        descripcion: mov.descripcionMovCaja,
        monto: parseFloat(mov.montoMovimiento) || 0,
        fecha: mov.fecha,
        hora: mov.hora,
        usuario: mov.nombreUsuario
      }));
      
      return {
        ok: true,
        data: movimientosFormateados
      };
    } else {
      console.warn('La respuesta no es un array:', movimientosData);
      return {
        ok: true,
        data: []
      };
    }
    
  } catch (error) {
    console.error('Error en obtenerMovimientosCajaServicio:', error);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.mensaje ||
                        error.message || 
                        'Error al obtener movimientos';
    
    throw new Error(errorMessage);
  }
};

export const obtenerMovimientosPorCajaServicio = async (idCaja) => {
  try {
    const respuesta = await API.get(`/caja/movimientos-caja/${idCaja}`);
    
    if (Array.isArray(respuesta.data)) {
      const movimientosFormateados = respuesta.data.map((mov, index) => ({
        id: `mov-${idCaja}-${index}-${Date.now()}`, // ID único temporal
        tipo: mov.tipoMovimiento?.toLowerCase() || 'ingreso',
        descripcion: mov.descripcionMovCaja || '',
        monto: parseFloat(mov.montoMovimiento) || 0,
        fecha: mov.fecha,
        hora: mov.hora,
        usuario: mov.nombreUsuario || 'Usuario'
      }));
      
      return {
        ok: true,
        data: movimientosFormateados,
        mensaje: `Se obtuvieron ${movimientosFormateados.length} movimientos`
      };
    } else {
      return {
        ok: false,
        mensaje: respuesta.data?.mensaje || "Error desconocido del servidor",
        data: []
      };
    }
    
  } catch (error) {
    console.error('Error en obtenerMovimientosPorCajaServicio:', error);
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error('No se pudo conectar con el servidor');
    }
    
    const status = error.response?.status;
    if (status === 404) {
      throw new Error('No se encontraron movimientos para esta caja');
    } else if (status === 401) {
      throw new Error('No autorizado para ver estos movimientos');
    } else {
      throw new Error(`Error del servidor: ${status}`);
    }
  }
};

// Servicio para obtener cajas cerradas
export const obtenerCajasCerradasServicio = async (limit = 10, offset = 0) => {
  try {
    const respuesta = await API.get(`/caja/registros-caja?limit=${limit}&offset=${offset}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener cajas cerradas");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener cajas cerradas:', error);
    throw error;
  }
};

// Servicio para obtener arqueos de caja (paginados)
export const obtenerArqueosCajaServicio = async (limit = 10, offset = 0) => {
  try {
    const respuesta = await API.get(`/caja/arqueos-caja?limit=${limit}&offset=${offset}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener arqueos");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener arqueos:', error);
    throw error;
  }
};

// Servicio para obtener arqueos de una caja específica
export const obtenerArqueosPorCajaServicio = async (idCaja) => {
  try {
    const respuesta = await API.get(`/caja/arqueos-caja/${idCaja}`);
    
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener arqueos de la caja");
    }
    
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener arqueos por caja:', error);
    throw error;
  }
};
