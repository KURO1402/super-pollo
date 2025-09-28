export const Paginacion = ({ paginaActual, totalPaginas, alCambiarPagina }) => {
  // generamos un array con los números de página
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1); 
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
      {/* Mostramos el número de página actual y el total */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Página <span className="font-medium">{paginaActual}</span> de{" "} 
        <span className="font-medium">{totalPaginas}</span> {/* el total */}
      </div>
      <div className="flex gap-2">
        {/* boton para ir a la página anterior */}
        <button
          onClick={() => alCambiarPagina(paginaActual - 1)} // restamos en uno a la pagian actual
          disabled={paginaActual === 1} // si es igual a uno desabilitamos el botón
          className="px-3 py-1 text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded disabled:opacity-0 disabled:cursor-default"
        >
          Anterior
        </button>
        {/* Botones para cada número de página */}
        {paginas.map((num) => (
          <button
            key={num}
            onClick={() => alCambiarPagina(num)}
            className={`px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 ${
              num === paginaActual
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            {num}
          </button>
        ))}
        {/* es similar al anterior boton, pero al vez de restar le sumamos  */} 
        <button
          onClick={() => alCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas} // si es igual al total de pag lo desabilitamos
          className="px-3 py-1 text-sm bg-gray-200 cursor-pointer hover:bg-gray-300 dark:bg-gray-600  dark:hover:bg-gray-500 rounded disabled:opacity-0 disabled:cursor-default"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};