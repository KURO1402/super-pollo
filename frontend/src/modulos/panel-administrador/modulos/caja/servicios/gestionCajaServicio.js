import API from "../../../../../app/servicio/axiosConfiguracion";

export const abrirCajaServicio = async (data) => {
  try {
    // Hacemos la solicitud con axios, que ya incluye el authorization y content-Type en los headers
    const respuesta = await API.post('/caja/abrir-caja', data);
    //verificamos que la respuesta sea correcta
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al abrir una caja");
    }
    
    return respuesta.data.mensaje;
  }
  catch (error) {
    console.error('Error al abrir caja:', error.message);
    throw error; // Lanza el error para que se maneje en el componente
  }

};

export const cerrarCajaServicio = async () => {
  try {
    const respuesta = await API.post('caja/cerrar-caja');
    if (!respuesta.data.ok) {
      throw new Error(respuesta.data.mensaje || "Error al cerrar una caja");
    }
    return respuesta.data.mensaje;
  } catch (error) {
    console.error('Error al cerrar caja:', error.message);
    throw error;
  }
};
