const enlaces = [
  { nombre: "INICIO", href: "#introduccion" },
  { nombre: "NOSOTROS", href: "#nosotros" },
  { nombre: "MENÚ", href: "#" },
  { nombre: "RESERVACIONES", href: "#" },
  { nombre: "CONTACTO", href: "#" },
];

const BarraNavegacion = () => {
  return (
    <nav>
      <ul className="flex flex-wrap justify-center space-x-4 lg:space-x-6">
        {enlaces.map(({ nombre, href }) => (
          <li key={nombre}>
            <a href={href} className="
              relative text-gray-100 text-sm font-medium
              transition-colors duration-200 hover:text-rojo
              after:content-[''] after:absolute after:bottom-0 after:left-0
              after:h-[2px] after:w-0 hover:after:w-full
              after:bg-rojo after:transition-all after:duration-300
              py-2 px-1
            ">
              {nombre}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BarraNavegacion;