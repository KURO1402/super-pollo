import MenuCategorias from "../componentes/MenuCategorias";
import MenuListado from "../componentes/MenuListado";

const MenuSeccion = () => {
  return (
    <section
      id="menu"
      className="bg-azul-primario py-16 px-6"
      aria-labelledby="menu-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="menu-heading"
            className="text-4xl font-bold text-rojo mb-4"
          >
            EXPLORA NUESTRA CARTA
          </h2>
          <p className="text-lg text-gray-100">
            Productos exquisitos, deliciosos y hechos con calidad y cariño.
          </p>
        </div>
        {/* Categorías del menú y listado de productos */}
        <MenuCategorias />
        <MenuListado />
      </div>
    </section>
  );
}

export default MenuSeccion;