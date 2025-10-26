import { FiArrowUp, FiEdit, FiTrash2, FiUser } from "react-icons/fi";

export const FilaSalida = ({ salida, onSalidaStock, onEliminarMovimiento  }) => {
  // Función para formatear la FECHA
  const formatearSoloFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear la HORA
  const formatearSoloHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEliminarClick = () => {
    onEliminarMovimiento(salida);
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
            <div className="text-xs text-gray-500">ID Mov: {salida.idMovimientoStock}</div>
          </div>
        </div>
      </td>

      {/* Cantidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            -{salida.cantidadMovimiento}
          </span>
        </div>
      </td>

      {/* Fecha (solo fecha) */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {formatearSoloFecha(salida.fechaMovimiento)}
        </div>
      </td>

      {/* Hora (solo hora) */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {formatearSoloHora(salida.fechaMovimiento)}
        </div>
      </td>

      {/* Usuario*/}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
          <FiUser size={14} className="text-gray-400" />
          ID: {salida.idUsuario}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {/* <button 
            onClick={() => onSalidaStock(salida)}
            className="p-1 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar salida"
          >
            <FiEdit size={16} />
          </button> */}
          <button 
            onClick={handleEliminarClick}
            className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title="Eliminar salida"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};