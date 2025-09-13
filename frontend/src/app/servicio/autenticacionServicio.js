import axios from 'axios'; // importamos axios para hacer periticiones al backend

// configuramos la instancia de axios con la URL base del backend y con credenciales para enviar cookies
const API = axios.create({
    baseURL: 'http://localhost:3001', // URL base del backend
    withCredentials: true, // para enviar cookies en solicitudes
})

// funcion para registrar usuario, recibe los datos del usuario
export const registrarUsuario = async (datos) => {
    try {
        const respuesta = await API.post('/usuarios/registrar', datos); // hacemos la peticion al backend
        return respuesta.data; // devolvemos la respuesta del backend
    } catch (error) {
        console.error('Error al registrar (servicio):', error.response?.data || error.message);
        throw error; // lanzamos el error para manejarlo en el componente
    }
}
