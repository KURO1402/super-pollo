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

// Obtener los movimientos de una por ID
export const obtenerMovimientosPorCajaServicio = async (idCaja) => {
  try {
    const respuesta = await API.get(`/caja/movimientos-caja/${idCaja}`);
    const data = respuesta.data;

    if (!Array.isArray(data)) {
      console.warn('La respuesta de movimientos no es un array:', data);
      return {
        ok: true,
        data: [],
        mensaje: "No se encontraron movimientos para esta caja"
      };
    }

    return {
      ok: true,
      data: data.map((mov, index) => ({
        ...mov,
        id: `mov-${idCaja}-${index}-${Date.now()}`
      })),
      mensaje: `Se obtuvieron ${data.length} movimientos`
    };

  } catch (error) {
    console.error('Error en obtenerMovimientosPorCajaServicio:', error);
    
    // Si el error es igual a 404, enviamos el array vacio
    if (error.response?.status === 404) {
      console.log(`No se encontraron movimientos para la caja ${idCaja}`);
      return {
        ok: true,
        data: [],
        mensaje: "No se encontraron movimientos para esta caja"
      };
    }
    
    // Para otros errores, lanzar excepción
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.mensaje ||
                        error.message || 
                        'Error al obtener movimientos';
    
    throw new Error(errorMessage);
  }
};

// Servicio para obtener arqueos de una caja específica
export const obtenerArqueosPorCajaServicio = async (idCaja) => {
  try {
    const respuesta = await API.get(`/caja/arqueos-caja/${idCaja}`);
    console.log('Respuestas del arqueo de la caja', respuesta.data)
    // retornamos ese mismo array
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener arqueos por caja:', error);
    return []; // devolvemos el array vacio
  }
};

// Servicio para obtener cajas cerradas
export const obtenerCajasCerradasServicio = async (limit = 10, offset = 0) => {
  try {
    const respuesta = await API.get(`/caja/registros-caja?limit=${limit}&offset=${offset}`);
    // el backend devuelve directamente el array
    const cajasCerradas = respuesta.data;
    
    return cajasCerradas; // Devuelve directamente el array
    
  } catch (error) {
    console.error('Error al obtener cajas cerradas:', error);
    return []; // Devuelve array vacío en caso de error
  }
};