import API from "../../../../../app/servicio/axiosConfiguracion";

// Obtener todas las categorías
export const obtenerCategoriasServicio = async () => {
  try {
    const respuesta = await API.get('/productos/categorias/all');
    
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

// Crear nueva categoría
export const crearCategoriaServicio = async (nombreCategoria) => {
  try {
    const respuesta = await API.post('/productos/categorias/agregar', {
      nombreCategoria: nombreCategoria
    });
    
    if (respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al crear categoría");
    }
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

// Actualizar categoría
export const actualizarCategoriaServicio = async (idCategoria, nombreCategoria) => {
  try {
    const respuesta = await API.put(`/productos/categorias/actualizar/${idCategoria}`, {
      nombreCategoria: nombreCategoria
    });
    
    if (respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data.mensaje || "Error al actualizar categoría");
    }
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};