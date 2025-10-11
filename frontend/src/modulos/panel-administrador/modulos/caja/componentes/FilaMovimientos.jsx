import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const FilaMovimientos = ({ movimiento, formatCurrency }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          movimiento.tipo === "ingreso" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {movimiento.tipo === "ingreso" ? (
            <FiTrendingUp className="w-3 h-3" />
          ) : (
            <FiTrendingDown className="w-3 h-3" />
          )}
          {movimiento.tipo === "ingreso" ? "Ingreso" : "Egreso"}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {movimiento.descripcion}
      </td>
      <td className={`px-6 py-4 text-sm font-medium ${
        movimiento.tipo === "ingreso" 
          ? "text-green-700 dark:text-green-400" 
          : "text-red-700 dark:text-red-400"
      }`}>
        {movimiento.tipo === "ingreso" ? "+" : "-"}{formatCurrency(movimiento.monto)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(movimiento.fecha)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {movimiento.usuario}
      </td>
    </tr>
  );
};

export default FilaMovimientos;