import axios from "axios";
// URL base del backend
const apiUrl = import.meta.env.VITE_BACKEND_URL; 

export const obtenerProductosServicio = async () => {
  try {
    const respuesta = await axios.get(`${apiUrl}/productos/`);
    console.log("lo que manda el backend:", respuesta)
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener los productos");
    }
  } catch (error) {
    console.error('Error en obtenerProductosServicio:', error);
    throw error;
  }
};

// funciones para traer las categorias
export const obtenerCategoriasServicio = async () => {
  try {
    const respuesta = await axios.get(`${apiUrl}/productos/categorias/all`);
    
    if (respuesta.data.ok) {
      return respuesta.data.categorias;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al obtener categorías");
    }
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};