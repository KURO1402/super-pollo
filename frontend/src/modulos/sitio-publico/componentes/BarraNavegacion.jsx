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

  return (
    <nav>
      <ul className="flex flex-wrap justify-center space-x-4 lg:space-x-6">
        {enlaces.map(({ nombre, enlace }) => (
          <li key={nombre}>
            {/* Verificar si estamos en la página principal O en /usuario */}
            {locacionRuta.pathname === "/" || locacionRuta.pathname === "/usuario" ? (
              // Si estamos en "/" o "/usuario" se usa react-scroll
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
              // Si esta en otra ruta, volvemos al home y se manda scrollTo
              <RouterLink
                to={locacionRuta.pathname.startsWith('/admin') ? "/" : "/usuario"} // Redirige según el área
                state={{ scrollTo: enlace }}
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