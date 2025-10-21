import { useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacionGlobal } from '../estado-global/autenticacionGlobal';
import { obtenerRutaRedireccion } from '../constantes/roles';

// Hook para manejar la redirección después del login
// Redirige según el rol del usuario
export const useRedireccionLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useAutenticacionGlobal((state) => state.usuario);
  
  /* Redirigir al usuario según su rol
  Si venía de una página específica (from), intenta volver ahí
  Si no, va a su área correspondiente */
   
  const redirigirSegunRol = () => {
    if (!usuario) return;

    // obtener de dónde venía el usuario (si existe)
    const from = location.state?.from?.pathname;

    // obtener la ruta correspondiente según su rol
    const rutaPorDefecto = obtenerRutaRedireccion(usuario.idRol);

    // si venía de algún lugar y tiene permisos, volver ahí
    // si no, ir a su área correspondiente
    const rutaDestino = from || rutaPorDefecto;

    navigate(rutaDestino, { replace: true });
  };

  return { redirigirSegunRol };
};