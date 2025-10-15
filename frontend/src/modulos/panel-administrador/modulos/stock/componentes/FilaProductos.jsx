export const FilaProducto = ({ producto, onVerReceta }) => {
  const getEstadoClases = (estado) => {
    if (estado === "Disponible") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* PRODUCTO */}
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-900 dark:text-white">
          {producto.nombre}
        </div>
      </td>
      
      {/* CATEGORÍA */}
      <td className="px-4 py-3">
        <span className="text-gray-600 dark:text-gray-400">
          {producto.categoria}
        </span>
      </td>
      
      {/* PRECIO */}
      <td className="px-4 py-3">
        <span className="font-semibold text-green-600 dark:text-green-400">
          S/{producto.precio.toFixed(2)}
        </span>
      </td>
      
      {/* ESTADO */}
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoClases(producto.estado)}`}>
          {producto.estado}
        </span>
      </td>
      
      {/* RECETA */}
      <td className="px-4 py-3">
        <span className="text-blue-600 dark:text-blue-400 text-sm">
          {producto.ingredientesReceta} ingrediente{producto.ingredientesReceta !== 1 ? 's' : ''}
        </span>
      </td>
      
      {/* ACCIONES */}
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => onVerReceta(producto)}
            className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Ver receta"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button 
            className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            title="Editar producto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};