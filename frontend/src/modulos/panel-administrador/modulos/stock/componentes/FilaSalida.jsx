import { FiArrowUp, FiEye, FiEdit, FiTrash2 } from "react-icons/fi"; // iconos para el diseño
// fila personalizada para el hostorial de salidas
export const FilaSalida = ({ salida }) => {
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
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <FiArrowUp className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {salida.nombreInsumo}
            </div>
            <div className="text-xs text-gray-500">ID: {salida.idInsumo}</div>
          </div>
        </div>
      </td>

      {/* Cantidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            -{salida.canfidadMovimiento}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {salida.unidadMedida}
          </span>
        </div>
      </td>

      {/* Fecha */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {formatearFecha(salida.fechaMovimiento)}
        </div>
      </td>

      {/* Detalles */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
          {salida.detallesMovimiento}
        </div>
      </td>

      {/* Usuario */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {salida.usuario}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="Ver detalles"
          >
            <FiEye size={16} />
          </button>
          <button 
            className="p-1 text-green-500 hover:text-green-700 transition-colors"
            title="Editar salida"
          >
            <FiEdit size={16} />
          </button>
          <button 
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar salida"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};