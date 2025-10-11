import { FiPackage, FiDroplet, FiAlertTriangle, FiEdit, FiTrash2 } from "react-icons/fi";

export const FilaInsumo = ({ insumo }) => {
  // Función para determinar el estado del stock
  const getEstadoStock = (stock) => {
    if (stock === 0) return { texto: 'Sin Stock', color: 'red', icono: <FiAlertTriangle size={14} /> };
    if (stock < 5) return { texto: 'Stock Bajo', color: 'red', icono: <FiAlertTriangle size={14} /> };
    if (stock < 15) return { texto: 'Stock Medio', color: 'orange', icono: <FiPackage size={14} /> };
    return { texto: 'Stock Bueno', color: 'green', icono: <FiPackage size={14} /> };
  };

  const estado = getEstadoStock(insumo.stockinsumo);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* Nombre del Insumo */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            insumo.categoriaProducto === 'bebida' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          }`}>
            {insumo.categoriaProducto === 'bebida' ? 
              <FiDroplet size={16} /> : 
              <FiPackage size={16} />
            }
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {insumo.nombreinsumo}
            </div>
            <div className="text-xs text-gray-500">ID: {insumo.idInsumo}</div>
          </div>
        </div>
      </td>

      {/* Categoría */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          insumo.categoriaProducto === 'bebida'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {insumo.categoriaProducto === 'bebida' ? 'Bebida' : 'Insumo'}
        </span>
      </td>

      {/* Stock Actual */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {insumo.stockinsumo}
        </div>
      </td>

      {/* Unidad de Medida */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {insumo.unidadMedida}
        </div>
      </td>

      {/* Estado del Stock */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          estado.color === 'red' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : estado.color === 'orange'
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {estado.icono}
          {estado.texto}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="Editar insumo"
          >
            <FiEdit size={16} />
          </button>
          <button 
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar insumo"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};