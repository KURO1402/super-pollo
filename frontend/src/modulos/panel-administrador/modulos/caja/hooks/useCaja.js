// hooks/useCaja.js
import { cajaEstadoGlobal } from "../estado-global/cajaEstadoGlobal";
import { 
  abrirCajaServicio,
  cerrarCajaServicio,
  registrarIngresoServicio,
  registrarEgresoServicio,
  registrarArqueoServicio,
  obtenerMovimientosCajaServicio
} from '../servicios/gestionCajaServicio';

export const useCaja = () => {
  const { 
    caja,
    loading,
    error,
    setCajaCompleta,
    setMovimientos,
    agregarMovimiento,
    abrirCaja,
    cerrarCaja,
    setLoading,
    setError,
    limpiarError,
    setEstado
  } = cajaEstadoGlobal();

  // Cargar datos iniciales de caja
  const cargarDatosCaja = async () => {
    console.log('estado: ', setEstado)
    try {
      setLoading(true);   
      limpiarError();

      // Cargar movimientos
      try {
        const movimientosResponse = await obtenerMovimientosCajaServicio();
        
        // Manejar diferentes estructuras de respuesta
        if (movimientosResponse.success || movimientosResponse.ok) {
          const movimientosData = movimientosResponse.data || 
                                 movimientosResponse.movimientos || 
                                 movimientosResponse;
          setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
        } else {
          console.warn('Movimientos no disponibles:', movimientosResponse.message);
          setMovimientos([]);
        }
      } catch (movimientosError) {
        console.error('Error cargando movimientos:', movimientosError);
        setError('Error al cargar movimientos: ' + movimientosError.message);
        setMovimientos([]); // Usar array vacío como fallback
      }

    } catch (error) {
      console.error('Error general en cargarDatosCaja:', error);
      setError('Error al cargar datos de caja: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  // Función para abrir caja
  const handleAbrirCaja = async (montoInicial) => {
    try {
      setLoading(true);
      limpiarError();

      const response = await abrirCajaServicio({ montoInicial: Number(montoInicial) });
      
      if (response.ok) {
        abrirCaja(Number(montoInicial));
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al abrir caja');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar caja
  const handleCerrarCaja = async () => {
    try {
      setLoading(true);
      limpiarError();

      const response = await cerrarCajaServicio();
      
      if (response.ok) {
        cerrarCaja();
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al cerrar caja');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar ingreso
  const handleRegistrarIngreso = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const movimientoData = {
        monto: Number(data.monto),
        descripcion: data.descripcion,
        tipo: 'ingreso',
        fecha: new Date().toISOString()
      };

      const response = await registrarIngresoServicio(movimientoData);
      
      if (response.ok) {
        await cargarDatosCaja();
        return response;
      } else {
        throw new Error(response.mensaje || response.message || 'Error al registrar ingreso');
      }

    } catch (error) {
      setError(error.message || 'Error al registrar ingreso');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar egreso
  const handleRegistrarEgreso = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const movimientoData = {
        monto: Number(data.monto),
        descripcion: data.descripcion,
        tipo: 'egreso',
        fecha: new Date().toISOString()
      };

      const response = await registrarEgresoServicio(movimientoData);
      
      if (response.ok) {
        await cargarDatosCaja();  
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al registrar egreso');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar arqueo
  const handleRegistrarArqueo = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const response = await registrarArqueoServicio(data);
      
      if (response.ok) {
        // Aquí puedes actualizar el estado si es necesario
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al registrar arqueo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    caja,
    loading,
    error,
    
    // Acciones
    cargarDatosCaja,
    handleAbrirCaja,
    handleCerrarCaja,
    handleRegistrarIngreso,
    handleRegistrarEgreso,
    handleRegistrarArqueo,
    limpiarError,
    
    // Estado computado
    cajaAbierta: caja.estado === "abierta"
  };
};