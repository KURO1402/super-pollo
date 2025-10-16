import axios from 'axios';
import { useAutenticacionGlobal } from '../estado-global/autenticacionGlobal'; // Importamos el estado global de autenticación

// Crear la instancia de Axios con la configuración básica
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,  // URL base del backend
    withCredentials: true,  // Permite que las cookies sean enviadas con las solicitudes
    headers: {
        'Content-Type': 'application/json',  // Establece el Content-Type globalmente
    },
});

// Interceptor para agregar el accessToken a las solicitudes
API.interceptors.request.use(
    (config) => {
        // Obtener el accessToken desde el estado global
        const accessToken = useAutenticacionGlobal.getState().accessToken;
        if (accessToken) {
            // si existe un accessToken, lo añadimos al header 'Authorization'
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar la renovación del accessToken si expira (status 403)
API.interceptors.response.use(
    (response) => response,  // Si la respuesta es exitosa, simplemente la pasamos
    async (error) => {
        const originalRequest = error.config;  // Guardamos la solicitud original
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;  // Marcamos la solicitud para que no entre en un bucle infinito de reintentos
            try {
                // Definir correctamente la URL base del backend
                const urlAPI = import.meta.env.VITE_BACKEND_URL;
                
                // Llamamos a la API para renovar el accessToken
                const refreshResponse = await axios.post(`${urlAPI}/usuarios/token`); // Ruta para renovar el token
                const nuevoAccessToken = refreshResponse.data.accessToken;

                if (nuevoAccessToken) {
                    // Actualizamos el token en el estado global de Zustand
                    useAutenticacionGlobal.getState().setAccessToken(nuevoAccessToken);

                    // Agregamos el nuevo accessToken a la solicitud original y la reintentamos
                    originalRequest.headers['Authorization'] = `Bearer ${nuevoAccessToken}`;

                    return API(originalRequest);  // Reintenta la solicitud original con el nuevo token
                } else {
                    throw new Error('No se pudo renovar el token.');
                }
            } catch (refreshError) {
                console.error('Error al renovar el token:', refreshError);
                // Si no podemos renovar el token, cerramos sesión y redirigimos al login
                useAutenticacionGlobal.getState().logout();
                window.location.href = '/login';  // O puedes mostrar un modal de error
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);  // Si no es un error 403, lo rechazamos
    }
);

export default API;