// se hacen las importaciones respectivas y se renombran para que no choquen ambas 
import { Link as ScrollLink } from "react-scroll"; // permit hacer scroll animado dentro de una página
import { Link as RouterLink, useLocation } from "react-router-dom"; // Link para el manejo de rutas y useLocation para saber la ubicaición actual

// array con los nombres y enlaces de las secciones
const enlaces = [
  { nombre: "INICIO", enlace: "introduccion" },
  { nombre: "NOSOTROS", enlace: "nosotros" },
  { nombre: "MENÚ", enlace: "menu" },
  { nombre: "RESERVACIONES", enlace: "reservaciones" },
  { nombre: "TRABAJA CON NOSOTROS", enlace: "trabaja" },
];

const BarraNavegacion = () => {
  // se obtiene la ruta actual 
  const locacionRuta = useLocation();

  return (
    <nav>
      <ul className="flex flex-wrap justify-center space-x-4 lg:space-x-6">
        {/* mapear todos los enlaces */}
        {enlaces.map(({ nombre, enlace }) => (
          <li key={nombre}>
            {/* verificar por cada enlace si se encuentra en la página principal '/' */}
            {locacionRuta.pathname === "/" ? (
              // Si estamos en la página principal se usa react-scroll
              <ScrollLink
                to={enlace} // cada uno de los enlace
                smooth={true} // Activa el scroll suave
                duration={500} // tiempo del scroll 
                offset={-70} // se utiliza esto ya que la cabecera es fija y esto hace que suba un poco
                className="relative cursor-pointer text-gray-100 text-sm font-medium
                  transition-colors duration-200 hover:text-rojo
                  after:content-[''] after:absolute after:bottom-0 after:left-0
                  after:h-[2px] after:w-0 hover:after:w-full
                  after:bg-rojo after:transition-all after:duration-300
                  py-2 px-1
                "
              >
                {nombre}
              </ScrollLink>
            ) : (
              // Si esta en otra ruta, volvemos al home y se manda scrollTo
              <RouterLink
                to="/" // redirige a la pagina principal
                state={{ scrollTo: enlace }} // Usa el estado de navegacion para enviar el "enlace" como señal
                className="relative cursor-pointer text-gray-100 text-sm font-medium
                  transition-colors duration-200 hover:text-rojo
                  after:content-[''] after:absolute after:bottom-0 after:left-0
                  after:h-[2px] after:w-0 hover:after:w-full
                  after:bg-rojo after:transition-all after:duration-300
                  py-2 px-1
                "
              >
                {nombre}
              </RouterLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BarraNavegacion;