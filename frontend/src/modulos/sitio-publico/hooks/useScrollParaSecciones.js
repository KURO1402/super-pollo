import { useEffect } from "react"; // hook dde react para ejecutar código cuando se monta o cambia ciertos valores
import { useLocation } from "react-router-dom"; //para acceder a la ubicación actual
import { scroller } from "react-scroll"; // para hacer scroll animado a una sección

const useScrollParaSecciones = () => {
  // guardamos la ruta actual
  const locacionRuta = useLocation();

  // se ejecuta cuando se cambia de ruta
  useEffect(() => {
    // intenta acceder a la ruta
    const section = locacionRuta.state?.scrollTo;
    // si resive un scrollTo ejecuta scroller.scrollTo y busca el elemento con ese id
    if (section) {
      scroller.scrollTo(section, {
        smooth: true, // animacion
        duration: 500, // duración del scroll
        offset: -70, // subir un poco para que la cabecera no tape esa parte
      });
    }
  }, [locacionRuta]); // cada vez que cambie de ruta, se ejecuta todo esto
};

export default useScrollParaSecciones; // exportamos el hook 
