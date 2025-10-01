import { useEffect } from "react";

// se recibe un objeto con 5 referencias a elementos DOM
function useAnimacionesIntro(referencias) {
  // se desestructura el objeto para obtener cada referencia por separado
  const { textoReferencia, polloReferencia, papasReferencia, ensaladaReferencia, lechugaReferencia } = referencias;

  // se ejecuta el useEffect una vez al montar el componente
  useEffect(() => {
    // si el elemento de texto existe, se le agrega la clase de animacion de css
    if (textoReferencia.current) {
      textoReferencia.current.classList.add("animate-fadeInUp");
    }
    // se aplica animaciones con retraso a cada imagen
    const timers = [
      // primero se utiliza setTimeout para ejecutar la animación, pasado el tiempo indicado
                      //accede al elemento DOm actual, se agrega ? para evitar errores si es nulo y se agrega la clase de animacion 
      setTimeout(() => polloReferencia.current?.classList.add("animate-float"), 300),
      setTimeout(() => papasReferencia.current?.classList.add("animate-float-slow"), 600),
      setTimeout(() => ensaladaReferencia.current?.classList.add("animate-float-slower"), 900),
      setTimeout(() => lechugaReferencia.current?.classList.add("animate-swing"), 1500),
    ];
    // se limpia el timeout al desmontar el componente para evitar errores
    return () => timers.forEach(clearTimeout);
    // el useEffect se vuelve a ejecutar si alguna de las referencias cambia
  }, [textoReferencia, polloReferencia, papasReferencia, ensaladaReferencia, lechugaReferencia]);
}

export default useAnimacionesIntro;