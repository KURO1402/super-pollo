import axios from 'axios';
import { useAutenticacionGlobal } from '../estado-global/autenticacionGlobal';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Interceptor para requests
API.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage');
        let accessToken = null;
        
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                accessToken = parsed.state.accessToken;
                console.log('Token usado en request:', accessToken);
            } catch (error) {
                console.error('Error parsing auth storage:', error);
            }
        }
        
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para responses
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if ((error.response?.status === 403 || error.response?.status === 401) && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/renovar-token')) {
            
            originalRequest._retry = true;
            
            try {
                console.log('Intentando renovar token...');
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/autenticacion/renovar-token`,
                    {},
                    { withCredentials: true }
                );
                const nuevoAccessToken = refreshResponse.data.accessToken;
                console.log('Token renovado exitosamente');
                // actualizar el token en el store o estado que tenemos
                useAutenticacionGlobal.getState().setAccessToken(nuevoAccessToken)
                // actualizar el header de la peticion original
                originalRequest.headers['Authorization'] = `Bearer ${nuevoAccessToken}`;
                // reintentar la petición con el nuevo token
                return API(originalRequest);

            } catch (refreshError) {
                console.error('Error al renovar token:', refreshError);
                // utilizar el logout del estado global para limpiar todo
                useAutenticacionGlobal.getState().logout();
                // eedirigir al login
                window.location.href = '/inicio-sesion';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default API;