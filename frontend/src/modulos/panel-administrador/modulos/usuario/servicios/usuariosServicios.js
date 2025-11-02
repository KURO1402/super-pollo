import API from "../../../../../app/servicio/axiosConfiguracion";

// Servicio para obtener todos los usuarios
export const obtenerUsuariosServicio = async () => {
  try {
    const respuesta = await API.get('/usuarios');
    
    if (respuesta.data && respuesta.data.ok) {
      
      return respuesta.data.usuarios;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuarios");
    }
  } catch (error) {
    console.error('Error en obtenerUsuariosServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para crear un nuevo usuario
export const eliminarUsuarioServicio = async (idUsuario) => {
  console.log("servicio id",idUsuario)
  try {
    const respuesta = await API.delete(`/usuarios/${idUsuario}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear usuario");
    }
  } catch (error) {
    console.error('Error en eliminarUsuarioServicio:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Servicio para actualizar un usuario
export const actualizarUsuarioServicio = async (idUsuario, datosActualizados) => {
  console.log("lo que recibimos: ", idUsuario, datosActualizados)
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
export const obtenerUsuarioPorIdServicio = async (idUsuario) => {
  try {
    const respuesta = await API.get(`/usuarios/${idUsuario}`);
    
    if (respuesta.data && respuesta.data.ok) {
      console.log("en el servecio:", respuesta.data)
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