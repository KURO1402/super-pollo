import axios from 'axios'; // importamos axios para hacer periticiones al backend

// configuramos la instancia de axios con la URL base del backend y con credenciales para enviar cookies
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // URL base del backend
    withCredentials: true, // para enviar cookies en solicitudes
})

// funcion para registrar usuario, recibe los datos del usuario
export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/registrar', datos); // hacemos la peticion al backend
        return respuesta.data; // devolvemos la respuesta del backend
    } catch (error) {
        console.error('Error al registrar (servicio):', error.response?.data || error.message);
        throw error; // lanzamos el error para manejarlo en el componente
    }
}

export const loginUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/login', datos); // tambien realizamos la peticion al backend
        return respuesta.data; // devolvemos la respuesta del backend para usarla en el componente
    } catch (error) {
        console.error('Error al iniciar sesión (servicio):', error.response?.data || error.message);
        throw error; // lanzamos el error para manejarlo en el componente
    }
}

// Servicios para verificación de correo
export const generarCodigoVerificacion = async (correo) => {
    try {
        const respuesta = await API.post('/autenticacion/generar-codigo', { correo });
        return respuesta.data;
    } catch (error) {
        console.error('Error al generar código (servicio):', error.response?.data || error.message);
        throw error;
    }
}

export const validarCodigoVerificacion = async (datos) => {
    try {
        const respuesta = await API.post('/autenticacion/validar-codigo', datos);
        return respuesta.data;
    } catch (error) {
        console.error('Error al validar código (servicio):', error.response?.data || error.message);
        throw error;
    }
}