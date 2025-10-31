import { useState, useCallback } from 'react';
import {
  obtenerCategoriasServicio,
  crearCategoriaServicio,
  actualizarCategoriaServicio
} from '../servicios/categoriasServicio';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar categorías
  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriasData = await obtenerCategoriasServicio();
      setCategorias(categoriasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear categoría
  const crearCategoria = useCallback(async (nombreCategoria) => {
    setLoading(true);
    setError(null);
    try {
      const response = await crearCategoriaServicio(nombreCategoria);
      
      // Agregar la nueva categoría al estado local
      const nuevaCategoria = {
        idCategoria: response.data?.idCategoria || Date.now(),
        nombreCategoria: nombreCategoria
      };
      
      setCategorias(prev => [...prev, nuevaCategoria]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar categoría
  const actualizarCategoria = useCallback(async (idCategoria, nombreCategoria) => {
    setLoading(true);
    setError(null);
    try {
      const response = await actualizarCategoriaServicio(idCategoria, nombreCategoria);
      
      // Actualizar en el estado local
      setCategorias(prev => 
        prev.map(cat =>
          cat.idCategoria === idCategoria 
            ? { ...cat, nombreCategoria }
            : cat
        )
      );
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    categorias,
    loading,
    error,
    
    // Acciones
    cargarCategorias,
    crearCategoria,
    actualizarCategoria,
    limpiarError
  };
};