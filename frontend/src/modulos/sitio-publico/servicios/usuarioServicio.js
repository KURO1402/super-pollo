import API from "../../../app/servicio/axiosConfiguracion";

// Servicio para actualizar un usuario
export const actualizarPerfilUsuarioServicio = async (idUsuario, datosActualizados) => {
  try {
    const respuesta = await API.put(`/usuarios/actualizar-usuario/${idUsuario}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar usuario");
    }
  } catch (error) {
    console.error('Error en actualizarUsuarioServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para obtener un usuario por ID
export const obtenerUsuarioActualServicio = async (idUsuario) => {
  try {
    const respuesta = await API.get(`/usuarios/${idUsuario}`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuario");
    }
  } catch (error) {
    console.error('Error en obtenerUsuarioPorIdServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para actualizar correo electrónico
export const actualizarCorreoUsuarioServicio = async (idUsuario, datos) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-correo/${idUsuario}`, datos);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar correo");
    }
  } catch (error) {
    console.error('Error en actualizarCorreoUsuarioServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para actualizar contraseña
export const actualizarClaveUsuarioServicio = async (idUsuario, datos) => {
  try {
    const respuesta = await API.patch(`/usuarios/actualizar-clave/${idUsuario}`, datos);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar contraseña");
    }
  } catch (error) {
    console.error('Error en actualizarClaveUsuarioServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};