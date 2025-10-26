import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
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

// Interceptor para responses - CON LOGS DE REFRESCO
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Verificar si es error 403 (token expirado)
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                console.log('🔄 Intentando renovar token...');
                
                const refreshResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/token`);
                const nuevoAccessToken = refreshResponse.data.accessToken;

                if (nuevoAccessToken) {
                    
                    // Actualizar el token en el estado global
                    const { useAutenticacionGlobal } = await import('../estado-global/autenticacionGlobal');
                    useAutenticacionGlobal.getState().setAccessToken(nuevoAccessToken);
                    
                    // Actualizar localStorage
                    const currentStorage = localStorage.getItem('auth-storage');
                    if (currentStorage) {
                        const parsed = JSON.parse(currentStorage);
                        const oldToken = parsed.state.accessToken;
                        parsed.state.accessToken = nuevoAccessToken;
                        localStorage.setItem('auth-storage', JSON.stringify(parsed));
                    }

                    // Actualizar header y reintentar
                    originalRequest.headers['Authorization'] = `Bearer ${nuevoAccessToken}`;
                    
                    return API(originalRequest);
                } else {
                    throw new Error('No se pudo renovar el token.');
                }
            } catch (refreshError) {
                console.error('Error al renovar token:', refreshError);
                
                const { useAutenticacionGlobal } = await import('../estado-global/autenticacionGlobal');
                useAutenticacionGlobal.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        // Si es error 401
        if (error.response && error.response.status === 401) {
            const { useAutenticacionGlobal } = await import('../estado-global/autenticacionGlobal');
            useAutenticacionGlobal.getState().logout();
            window.location.href = '/inicio-sesion';
        }
        
        return Promise.reject(error);
    }
);

export default API;