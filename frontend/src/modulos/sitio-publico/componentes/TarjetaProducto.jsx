const TarjetaProducto = ({ nombre, descripcion, precio, imagen }) => {
  return (
    <div className="bg-azul-secundario rounded-2xl border border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative flex flex-col md:flex-row h-auto md:h-56">
      {/* Contenedor de imagen  */}
      <div className="relative md:w-2/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-70 z-10 md:hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent opacity-70 z-10 hidden md:block"></div>
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-48 md:h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        {/* Efecto de brillo */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
      </div>
      
      {/* Contenido */}
      <div className="p-5 md:p-6 relative z-20 flex-1 flex flex-col justify-center">
        {/* Línea decorativa */}
        <div className="w-12 h-1 bg-red-600 mb-3 transform group-hover:scale-x-125 transition-transform duration-500"></div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
          {nombre}
        </h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed border-l-2 border-red-600 pl-3">
          {descripcion}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <span className="text-rojo font-bold text-2xl tracking-wide">
            {precio}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;