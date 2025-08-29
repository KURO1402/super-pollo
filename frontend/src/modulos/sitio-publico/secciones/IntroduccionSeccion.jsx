import { useRef } from "react"; // importamos useRef para crear referencias a elementos DOM
// importamos tambien las imagenes
import useAnimacionesIntro from "../hooks/useAnimacionesIntro";
import CirculoRojo from "../../../assets/decorativos/Mitad_circulo_rojo.png";
import Lechuga from "../../../assets/decorativos/Lechuga.png";
import Pollos from "../../../assets/imagenes/Pollos.png";
import Papas from "../../../assets/imagenes/Papas.png";
import Ensalada from "../../../assets/imagenes/Ensalada.png";
// impoertar los botones 
import BotonPrimario from "../componentes/BotonPrimario";
import BotonSecundario from "../componentes/BotonSecundario";
import '../estilos/animaciones.css' // importar las animaciones CSS

const IntroduccionSeccion = () => {
  // se crean las referencias a los elementos que se quieren animar
  const textoReferencia = useRef(null);
  const polloReferencia = useRef(null);
  const papasReferencia = useRef(null);
  const ensaladaReferencia = useRef(null);
  const lechugaReferencia = useRef(null);
  // se llama al hook para aplicar las animaciones y se le pasan las referencias
  useAnimacionesIntro({ textoReferencia, polloReferencia, papasReferencia, ensaladaReferencia, lechugaReferencia });

  return (
    <section
      id="introduccion"
      className="fondo-madera-oscuro relative w-full h-screen md:h-[80vh] lg:h-screen text-white overflow-hidden px-4 md:px-8 lg:px-16 py-6"
      aria-labelledby="hero-heading"
    >
      {/* decorativos */}
      <img src={CirculoRojo} alt="" aria-hidden="true"
        className="absolute right-0 w-auto h-auto z-10 hidden lg:block transform"
      />
      {/* se le coloca la referencia para animarla, así con todos xd*/}
      <img ref={lechugaReferencia} src={Lechuga} alt="Decoración de lechuga"
        className="absolute top-10 left-0 w-40 h-auto z-20 md:block hidden transform -rotate-12"
      />

      {/* Contenido */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 min-h-screen">
        <div ref={textoReferencia} className="opacity-0 text-center lg:text-left">
          <h2 id="hero-heading" className="text-3xl md:text-4xl font-semibold text-amarillo mb-4">
            LOS MEJORES
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6">
            POLLOS A LA <span className="text-rojo">BRASA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
            Disfruta del auténtico sabor de la cocina peruana con nuestro pollo a la brasa, preparado con las mejores especias y técnicas tradicionales.
          </p>
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <BotonPrimario>Ver Menú</BotonPrimario>
            <BotonSecundario>Hacer Reserva</BotonSecundario>
          </div>
        </div> 

        {/* Imágenes del plato */}
        <div className="hidden lg:relative lg:flex lg:justify-center lg:items-center h-96 lg:h-auto mt-8 lg:mt-0">
          <img ref={polloReferencia} src={Pollos} alt="Pollo a la brasa" className="relative w-64 md:w-auto h-auto z-30 opacity-0 transition-opacity duration-1000"/>
          <img ref={papasReferencia} src={Papas} alt="Papas fritas" className="absolute bottom-0 left-0 lg:left-10 w-75 h-auto z-40 opacity-0 transition-opacity duration-1000"/>
          <img ref={ensaladaReferencia} src={Ensalada} alt="Ensalada fresca" className="absolute top-32 lg:top-50 right-0 lg:right-5 translate-y-4 lg:translate-y-10 w-70 h-auto z-40 opacity-0 transition-opacity duration-1000"/>
        </div>
      </div>
    </section>
  );
};

export default IntroduccionSeccion;