import { useEffect } from "react"; 
import { useLocation } from "react-router-dom"; // permite obtener la ruta actual y responde a cambios en la navegacion

const useScrollAlInicio = () => {
  //extrae la propiedad pathname del objeto de ubicación actual
  const { pathname } = useLocation();
  // useEffect se ejecuta cada vez que cambia el pathname, es decir la ruta
  useEffect(() => {
    // Hace scroll hacia el inicio de la página (posición 0,0)
    window.scrollTo(0, 0);
  }, [pathname]); // Dependencia -> solo se ejecuta cuando cambia la ruta
};

//exportar 
export default useScrollAlInicio;