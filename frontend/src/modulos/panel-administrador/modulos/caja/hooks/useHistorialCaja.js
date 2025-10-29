import { useState, useEffect } from 'react';
import { 
  obtenerCajasCerradasServicio,
  obtenerArqueosPorCajaServicio
} from '../servicios/gestionCajaServicio';

export const useHistorialCajas = () => {
  // Estado para cajas cerradas
  const [cajasCerradas, setCajasCerradas] = useState([]);
  const [loadingCajas, setLoadingCajas] = useState(false);
  const [errorCajas, setErrorCajas] = useState(null);

  // Estado para arqueos
  const [arqueosPorCaja, setArqueosPorCaja] = useState([]);
  const [loadingArqueos, setLoadingArqueos] = useState(false);
  const [errorArqueos, setErrorArqueos] = useState(null);

  // Cargar cajas cerradas
  const cargarCajasCerradas = async (pagina = 1, limite = 10) => {
    setLoadingCajas(true);
    setErrorCajas(null);
    try {
      const offset = (pagina - 1) * limite;
      const cajasData = await obtenerCajasCerradasServicio(limite, offset);
      
      // seteamos el estado
      setCajasCerradas(cajasData);
      
    } catch (err) {
      setErrorCajas(err.message);
    } finally {
      setLoadingCajas(false);
    }
  };

  // Cargar arqueos
  const cargarArqueos = async (idCaja) => {
    setLoadingArqueos(true);
    setErrorArqueos(null);
    try {
      const arqueosData = await obtenerArqueosPorCajaServicio(idCaja);
      
      // el backend solo devuelve el array
      setArqueosPorCaja(arqueosData);
      
    } catch (err) {
      setErrorArqueos(err.message);
    } finally {
      setLoadingArqueos(false);
    }
  };

  // Cargar todo el historial
  const cargarTodoHistorial = async () => {
    await cargarCajasCerradas();
  };

  // Utilidades compartidas
  const formatCurrency = (cantidad) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(cantidad);
  };

  // Función para formatear fecha
  const formatDate = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Cargar datos al inicializar
  useEffect(() => {
    cargarCajasCerradas();
  }, []);

  return {
    // Cajas cerradas
    cajasCerradas,
    loadingCajas,
    errorCajas,
    cargarCajasCerradas,
    
    // Arqueos
    arqueosPorCaja,
    loadingArqueos,
    errorArqueos,
    cargarArqueos,
    
    // Acciones combinadas
    cargarTodoHistorial,
    
    // Utilidades compartidas
    formatCurrency,
    formatDate,
  };
};