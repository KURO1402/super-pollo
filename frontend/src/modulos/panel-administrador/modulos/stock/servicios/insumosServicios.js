import API from "../../../../../app/servicio/axiosConfiguracion";

export const crearInsumoServicio = async (data) => {
  try {
    // Hacemos la solicitud con axios
    const respuesta = await API.post('/inventario/crear', data);

    // Verificamos si la respuesta tiene un código de estado exitoso (2xx)
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el insumo");
    }
  } catch (error) {
    console.error('Error en crearInsumoServicio:', error);
    throw error; // Lanza el error para que lo maneje el componente
  }
};

export const listarInsumoServicio = async () => {
  try {
    // Hacemos la solicitud con axios, que ya incluye el authorization y content-Type en los headers
    const respuesta = await API.get('/inventario/');
    //verificamos que la respuesta sea correcta
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al listar los insumos");
    }
    return respuesta.data;
  }
  catch (error) {
    console.error('Error al listar insumos:', error.message);
    throw error; // Lanza el error para que se maneje en el componente
  }
};

export const obtenerInsumoIdServicio = async (id) => {
  try {
    const respuesta = await API.get(`/inventario/${id}`);
    //verificamos que la respuesta sea correcta
    if (!respuesta.ok) {
      throw new Error(respuesta.data.mensaje || "Error al obtener el insumo");
    }
    return respuesta.ok;
  }
  catch (error) {
    console.error('Error al obtener el insumo:', error.message);
    throw error; // Lanza el error para que se maneje en el componente
  }
};

export const actualizarInsumoServicio = async (id, data) => {
  try {
    const respuesta = await API.put(`/inventario/${id}`, data);
    //verificamos que la respuesta sea correcta
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al actualizar el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    console.error('Error al actualizar el insumo:', error.message);
    throw error; // Lanza el error para que se maneje en el componente
  }
};

export const eliminarInsumoServicio = async (id) => {
  try {
    const respuesta = await API.delete(`/inventario/${id}`);
    //verificamos que la respuesta sea correcta
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al eliminar el insumo");
    }
    return respuesta.data;
  }
  catch (error) {
    console.error('Error al eliminar el insumo:', error.message);
    throw error; // Lanza el error para que se maneje en el componente
  }
};