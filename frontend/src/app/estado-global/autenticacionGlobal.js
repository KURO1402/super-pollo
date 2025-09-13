import { create } from 'zustand'; // importamos zustand para crear el estado global
import { registrarUsuario } from '../servicio/autenticacionServicio'; // importamos el servicio de autenticacion

// creamos el estado global para la autenticacion
export const useAutenticacionGlobal = create((set) => ({
    usuario: null, // estado para el usuario
    accessToken: null, // estado para el token de acceso
    error: null, // estado para el error
    carga: false, // estado para la carga

    registrar: async ( datos ) => {
        try {
            set({ carga: true, erro: null }); // seteamos la carga a true y el error a null
            const respuesta = await registrarUsuario(datos); // llamamos al servicio de registro
            set({ usuario: respuesta.usuario, accessToken: respuesta.accessToken,}); // seteamos el usuario y el token de acceso
            return respuesta.usuario; // devolvemos el usuario registrado
        } catch (err) {
            set({ error: err.response?.data?.mensaje || 'Error al registrar usuario' }); // seteamos el error
        } finally {
            set({ carga: false }); // seteamos la carga a false
        }
    }
}))