import { useState, useEffect } from 'react';
import { obtenerProductosServicio } from '../servicios/productoServicios';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerProductosServicio();
      setProductos(respuesta.productos || []);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener productos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return {
    productos,
    cargando,
    error,
    refetch: obtenerProductos
  };
};