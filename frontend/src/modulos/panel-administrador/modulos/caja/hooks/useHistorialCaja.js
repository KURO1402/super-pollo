// hooks/useHistorialCajas.js
import { useState, useEffect } from 'react';
import { 
  obtenerCajasCerradasServicio, 
  obtenerArqueosPorCajaServicio,
  obtenerMovimientosPorCajaServicio 
} from '../servicios/gestionCajaServicio';

export const useHistorialCajas = () => {
  const [cajasCerradas, setCajasCerradas] = useState([]);
  const [arqueosCaja, setArqueosCaja] = useState([]);
  const [movimientosCaja, setMovimientosCaja] = useState([]);
  const [loadingCajas, setLoadingCajas] = useState(false);
  const [loadingArqueos, setLoadingArqueos] = useState(false);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [errorCajas, setErrorCajas] = useState(null);
  const [errorArqueos, setErrorArqueos] = useState(null);
  const [errorMovimientos, setErrorMovimientos] = useState(null);

  // Cargar cajas cerradas al inicializar
  useEffect(() => {
    cargarCajasCerradas();
  }, []);

  const cargarCajasCerradas = async () => {
    setLoadingCajas(true);
    setErrorCajas(null);
    try {
      const cajas = await obtenerCajasCerradasServicio();
      setCajasCerradas(cajas);
    } catch (error) {
      setErrorCajas(error.message);
      console.error('Error al cargar cajas cerradas:', error);
    } finally {
      setLoadingCajas(false);
    }
  };

  // funcion para cargar arqueos de una caja específica
  const cargarArqueosCaja = async (idCaja) => {
    setLoadingArqueos(true);
    setErrorArqueos(null);
    try {
      const arqueos = await obtenerArqueosPorCajaServicio(idCaja);
      setArqueosCaja(arqueos);
      return arqueos;
    } catch (error) {
      setErrorArqueos(error.message);
      throw error;
    } finally {
      setLoadingArqueos(false);
    }
  };

  // funcion para cargar movimientos de una caja específica
  const cargarMovimientosCaja = async (idCaja) => {
    setLoadingMovimientos(true);
    setErrorMovimientos(null);
    try {
      const movimientos = await obtenerMovimientosPorCajaServicio(idCaja);
      setMovimientosCaja(movimientos || []);
    } catch (error) {
      setErrorMovimientos(error.message);
      throw error;
    } finally {
      setLoadingMovimientos(false);
    }
  };

  // funcion para cargar todos los datos de una caja 
  const cargarDetallesCompletosCaja = async (idCaja) => {
    try {
      await Promise.all([
        cargarArqueosCaja(idCaja),
        cargarMovimientosCaja(idCaja)
      ]);
    } catch (error) {
      console.error('Error al cargar detalles completos:', error);
      throw error;
    }
  };

  // Funcion para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return `S/ ${numericAmount.toFixed(2)}`;
  };

  function formatHora(hora) {
    const date = new Date('1970-01-01T' + hora + ':00'); 
    const opciones = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    };
    return date.toLocaleTimeString('es-ES', opciones);
  }

  return {
    // Estados
    cajasCerradas,
    arqueosCaja,
    movimientosCaja,
    loadingCajas,
    loadingArqueos,
    loadingMovimientos,
    errorCajas,
    errorArqueos,
    errorMovimientos,
    
    // Funciones
    cargarCajasCerradas,
    cargarArqueosCaja,
    cargarMovimientosCaja,
    cargarDetallesCompletosCaja,
    formatDate,
    formatCurrency,
    formatHora
  };
};