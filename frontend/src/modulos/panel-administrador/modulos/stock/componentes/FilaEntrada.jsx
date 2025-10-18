import { FiArrowDown, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export const FilaEntrada = ({ entrada }) => {
  // Formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* Insumo */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <FiArrowDown className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {entrada.nombreInsumo}
            </div>
            <div className="text-xs text-gray-500">ID: {entrada.idInsumo}</div>
          </div>
        </div>
      </td>

      {/* Cantidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            +{entrada.canfidadMovimiento}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {entrada.unidadMedida}
          </span>
        </div>
      </td>

      {/* Fecha */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {formatearFecha(entrada.fechaMovimiento)}
        </div>
      </td>

      {/* Detalles */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
          {entrada.detallesMovimiento}
        </div>
      </td>

      {/* Usuario */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {entrada.usuario}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            className="p-1 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer" 
            title="Editar entrada"
          >
            <FiEdit size={16} />
          </button>
          <button 
            className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title="Eliminar entrada"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};