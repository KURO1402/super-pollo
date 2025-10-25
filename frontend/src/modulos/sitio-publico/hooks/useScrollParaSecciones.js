import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";

const useScrollParaSecciones = () => {
  const locacionRuta = useLocation();

  useEffect(() => {
    const section = locacionRuta.state?.scrollTo;
    
    if (section) {
      // Pequeño delay para asegurar que la página esté cargada
      const timer = setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -70,
          // Añadir opciones de fallback
          ignoreCancelEvents: false,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [locacionRuta]);

  // Función auxiliar para hacer scroll manualmente
  const scrollToSection = (section) => {
    scroller.scrollTo(section, {
      smooth: true,
      duration: 500,
      offset: -70,
    });
  };

  return { scrollToSection };
};

export default useScrollParaSecciones;