import { useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacionGlobal } from '../estado-global/autenticacionGlobal';
import { obtenerRutaRedireccion } from '../constantes/roles';


export const useRedireccionLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useAutenticacionGlobal((state) => state.usuario);
   
  const redirigirSegunRol = () => {
    if (!usuario) return;

    const from = location.state?.from?.pathname;

    const rutaPorDefecto = obtenerRutaRedireccion(usuario.idRol);

    const rutaDestino = from || rutaPorDefecto;

    navigate(rutaDestino, { replace: true });
  };

  return { redirigirSegunRol };
};