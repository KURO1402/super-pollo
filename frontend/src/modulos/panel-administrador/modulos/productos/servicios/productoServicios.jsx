import API from "../../../../../app/servicio/axiosConfiguracion";

export const crearProductoServicio = async (formData) => {
  try {
    console.log('📤 Enviando FormData al backend:');
    
    // Verificar qué contiene el FormData (para debugging)
    for (let [key, value] of formData.entries()) {
      if (key === 'image') {
        console.log(`🔍 ${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`🔍 ${key}:`, value);
      }
    }
    
    const respuesta = await API.post('/productos/agregar-producto', formData);

    // Verificamos si la respuesta tiene un código de estado exitoso (2xx)
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear el producto");
    }
  } catch (error) {
    console.error('❌ Error en crearProductoServicio:', error);
    console.error('📋 Response data:', error.response?.data);
    console.error('📋 Status:', error.response?.status);
    throw error; // Lanza el error para que lo maneje el componente
  }
};