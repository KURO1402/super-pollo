import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAutenticacionGlobal } from "../app/estado-global/autenticacionGlobal";
import { obtenerRutaRedireccion } from "./constantes/roles";;

/**
 * Componente para proteger rutas según roles
 * @param {Array} rolesPermitidos - Array de IDs de roles que pueden acceder
 * @param {string} redirectTo - Ruta personalizada de redirección (opcional)
 */

const RutaPrivadaConRol = ({ rolesPermitidos, redirectTo }) => {
  const usuario = useAutenticacionGlobal((state) => state.usuario); // obtenemos el usuario del estado global
  const location = useLocation();

  if (!usuario) {
    // Si no esta logeado redirige al login
    return (
      <Navigate
        to="/inicio-sesion"
        replace
        state={{ from: location }} // guardamos la ubicacion actual para redirigir despues del login
        />
    );
  }
    // si está logueado pero no tiene el rol adecuado
  if (!rolesPermitidos.includes(usuario.idRol)) {
    // redirigir a su área correspondiente según su rol
    const rutaCorrecta = redirectTo || obtenerRutaRedireccion(usuario.idRol);
    return <Navigate to={rutaCorrecta} replace />;
  }

  // Tiene permisos renderiza el contenido
  return <Outlet />;
};

export default RutaPrivadaConRol;