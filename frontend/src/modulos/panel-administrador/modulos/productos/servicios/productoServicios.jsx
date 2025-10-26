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