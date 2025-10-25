import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";

const enlaces = [
  { nombre: "INICIO", enlace: "introduccion" },
  { nombre: "NOSOTROS", enlace: "nosotros" },
  { nombre: "MENÚ", enlace: "menu" },
  { nombre: "RESERVACIONES", enlace: "reservaciones" },
  { nombre: "TRABAJA CON NOSOTROS", enlace: "trabaja" },
];

const BarraNavegacion = () => {
  const locacionRuta = useLocation();

  // Determinar si estamos en una página donde funciona el scroll
  const esPaginaConScroll = () => {
    return locacionRuta.pathname === "/" || locacionRuta.pathname === "/usuario";
  };

  // Determinar la ruta de destino para redirección
  const obtenerRutaDestino = () => {
    if (locacionRuta.pathname.startsWith('/admin')) {
      return "/";
    } else {
      return "/";
    }
  };

  return (
    <nav>
      <ul className="flex flex-wrap justify-center space-x-4 lg:space-x-6">
        {enlaces.map(({ nombre, enlace }) => (
          <li key={nombre}>
            {esPaginaConScroll() ? (
              // Si estamos en página con scroll, usar react-scroll
              <ScrollLink
                to={enlace}
                smooth={true}
                duration={500}
                offset={-70}
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
              // Si estamos en otra ruta, redirigir al inicio con scroll
              <RouterLink
                to={{
                  pathname: obtenerRutaDestino(),
                  state: { scrollTo: enlace }
                }}
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