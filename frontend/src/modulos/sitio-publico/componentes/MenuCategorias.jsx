import { FaBorderAll } from "react-icons/fa6";
import { GiChickenOven } from "react-icons/gi";
import { RiDrinks2Fill } from "react-icons/ri";
import { LuSalad } from "react-icons/lu";
import { LuDessert } from "react-icons/lu";

// Array de categorías con sus respectivos iconos
const categorias = [
  { nombre: "Todos", icono: <FaBorderAll /> },
  { nombre: "Pollos", icono: <GiChickenOven /> },
  { nombre: "Bebidas", icono: <RiDrinks2Fill /> },
  { nombre: "Extras", icono: <LuSalad /> },
  { nombre: "Postres", icono: <LuDessert /> },
];

const MenuCategorias = () => {
  return (
    <div className="flex justify-center gap-4 md:gap-6 mb-10 flex-wrap px-4">
      {/* mapeo de categorías para crear botones interactivos */} 
      {categorias.map((cat) => (
        <button
          key={cat.nombre}
          className="flex flex-col items-center gap-2 px-4 py-3 md:px-5 md:py-4 hover:bg-rojo rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
        >
          {/* Efecto de fondo con animación */}
          <div className="absolute inset-0 bg-rojo opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>

          {/* Icono con efecto de aumento */}
          <div className="text-3xl md:text-4xl text-rojo group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
            {cat.icono}
          </div>

          {/* Texto con transición suave */}
          <span className="text-xs md:text-sm font-semibold text-gray-100 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
            {cat.nombre}
          </span>

          {/* Indicador de selección (opcional) */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-8 h-1 bg-white rounded-t-full transition-all duration-300"></div>
        </button>
      ))}
    </div>
  );
};
export default MenuCategorias;
