import API from "../../../../../app/servicio/axiosConfiguracion";

export const crearProductoServicio = async (formData) => {
  try {
    const respuesta = await API.post('/productos/agregar-producto', formData);

    // Verificamos si la respuesta tiene un código de estado exitoso (2xx)
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el producto");
    }
  } catch (error) {
    console.error('Error en crearProductoServicio:', error);
    throw error; // Lanza el error para que lo maneje el componente
  }
};

// funcion para traer los productos de la base de datos
export const obtenerProductosServicio = async () => {
  try {
    const respuesta = await API.get('/productos/');
    
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
// funcion para actulizar un producto
export const actualizarProductoServicio = async (idProducto, datosActualizados) => {
  try {
    
    const respuesta = await API.put(`/productos/actualizar-producto/${idProducto}`, datosActualizados);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar el producto");
    }
  } catch (error) {
    console.error('Error en actualizarProductoServicio:', error);
    throw error;
  }
};
// Efunción para eliminar un productp
export const eliminarProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.delete(`/productos/eliminar-producto/${idProducto}`);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al eliminar el producto");
    }
  } catch (error) {
    console.error('Error en eliminarProductoServicio:', error);
    throw error;
  }
};

// Agregar insumo a un producto
export const agregarInsumoProductoServicio = async (datos) => {
  try {
    console.log('Agregando insumo a producto:', datos);
    
    const respuesta = await API.post('/productos/agregar-cantidad', datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al agregar insumo al producto");
    }
  } catch (error) {
    console.error('Error en agregarInsumoProductoServicio:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Modificar cantidad de insumo
export const modificarCantidadInsumoServicio = async (datos) => {
  try {
    console.log('Modificando cantidad de insumo:', datos);
    
    const respuesta = await API.patch('/productos/modificar-cantidad', datos);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al modificar cantidad del insumo");
    }
  } catch (error) {
    console.error('Error en modificarCantidadInsumoServicio:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Eliminar insumo de un producto
export const eliminarInsumoProductoServicio = async (datos) => {
  try {
    console.log('Eliminando insumo de producto:', datos);
    
    const respuesta = await API.delete('/productos/eliminar-cantidad', { data: datos });

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al eliminar insumo del producto");
    }
  } catch (error) {
    console.error('Error en eliminarInsumoProductoServicio:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Obtener insumos de un producto
export const obtenerInsumosProductoServicio = async (idProducto) => {
  try {
    const respuesta = await API.get(`/productos/insumos-cantidad/${idProducto}`);

    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener insumos del producto");
    }
  } catch (error) {
    if (error.response?.status === 404) {
      // para un producto sin insumos se devuelve el array vacio
      return {
        ok: true,
        insumos: []
      };
    }
    
    console.error('Error en obtenerInsumosProductoServicio:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};