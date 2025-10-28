// hooks/useCaja.js
import mostrarAlerta from "../../../../../utilidades/toastUtilidades";
import { cajaEstadoGlobal } from "../estado-global/cajaEstadoGlobal";
import { 
  abrirCajaServicio,
  cerrarCajaServicio,
  registrarIngresoServicio,
  registrarEgresoServicio,
  registrarArqueoServicio,
  obtenerMovimientosCajaServicio,
  obtenerMovimientosPorCajaServicio
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

  const cargarDatosCaja = async () => {
    try {
      setLoading(true);   
      limpiarError();

      // solo cargar movimientos si tenemos idCaja y la caja está abierta
      if (caja.idCaja && caja.estado === "abierta") {
        
        const movimientosResponse = await obtenerMovimientosPorCajaServicio(caja.idCaja);
        
        if (movimientosResponse.ok) {
          // Ahora usamos movimientosResponse.data que contiene el array
          const movimientosData = movimientosResponse.data || [];
          setMovimientos(Array.isArray(movimientosData) ? movimientosData : []);
        } else {
          console.warn('Movimientos no disponibles:', movimientosResponse.message);
          setMovimientos([]);
        }
      } else {
        setMovimientos([]);
      }

    } catch (error) {
      console.error('Error en cargarDatosCaja:', error);
      setError('Error al cargar movimientos: ' + error.message);
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
        // guardamos el id de la caja
        const idCaja = response.idCaja; 
        
        if (!idCaja) {
          throw new Error("No se recibió el ID de la caja al abrir");
        }

        console.log("Caja abierta con ID:", idCaja);

        // Actualizar el estado con el idCaja real
        abrirCaja({
          idCaja: idCaja, // guardamos el id que nos devuelve el backend 
          saldoInicial: Number(montoInicial),
          saldoActual: Number(montoInicial)
        });

        // Cargar movimientos
        await cargarDatosCaja();
        
        return response;
      } else {
        throw new Error(response.mensaje || "Error al abrir caja");
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
      mostrarAlerta.error('Arqueo requerido antes de cerrar');
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