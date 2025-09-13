import { Navigate, Outlet } from "react-router-dom";
import { useAutenticacionGlobal } from "../app/estado-global/autenticacionGlobal";

const RutaPrivadaConRol = ({ rolesPermitidos }) => {
  const usuario = useAutenticacionGlobal((state) => state.usuario); // obtenemos el usuario del estado global

  if (!usuario) {
    // Si no esta logeado redirige al login
    return <Navigate to="/inicio-sesion" replace />;
  }
    // si está logueado pero no tiene el rol adecuado
  if (!rolesPermitidos.includes(usuario.idRol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Tiene permisos renderiza los hijos
  return <Outlet />;
};

export default RutaPrivadaConRol;