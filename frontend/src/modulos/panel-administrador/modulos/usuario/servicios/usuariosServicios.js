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
    throw error;
  }
};

// Servicio para crear un nuevo usuario
export const eliminarUsuarioServicio = async (idUsuario) => {
  try {
    const respuesta = await API.delete(`/usuarios/${idUsuario}`);
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al crear usuario");
    }
  } catch (error) {
    console.error('Error en eliminarUsuarioServicio:', error);
    throw error;
  }
};

// Servicio para actualizar un usuario
export const actualizarUsuarioServicio = async (idUsuario, datosActualizados) => {
  try {
    const respuesta = await API.put(`/usuarios/actualizar-usuario/${idUsuario}`, datosActualizados);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al actualizar usuario");
    }
  } catch (error) {
    console.error('Error en actualizarUsuarioServicio:', error);
    throw error;
  }
};

// Servicio para obtener un usuario por ID
export const obtenerUsuarioPorIdServicio = async (idUsuario) => {
  try {
    const respuesta = await API.get(`/usuarios/${idUsuario}`);
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || "Error al obtener usuario");
    }
  } catch (error) {
    console.error('Error en obtenerUsuarioPorIdServicio:', error);
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

export const listarRolesServicio = async () => {
  try {
    const respuesta = await API.get('/usuarios/roles');
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al listar los roles');
    }
  } catch (error) {
    console.error('Error en listarRolesServicio:', error);
    throw error;
  }
};

export const actualizarRolUsuarioServicio  = async (idUsuario, idRolNuevo) => {
  try {
    const respuesta = await API.patch(`/usuarios/cambiar-rol/${idUsuario}`, {
      nuevoRol: idRolNuevo
    });
    
    if (respuesta.data && respuesta.data.ok) {
      return respuesta.data;
    } else {
      throw new Error(respuesta.data?.mensaje || 'Error al listar los roles');
    }
  } catch (error) {
    console.error('Error en listarRolesServicio:', error);
    throw error;
  }
};