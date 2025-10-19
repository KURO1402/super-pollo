import { FiTrash2, FiEdit  } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export const FilaProducto = ({ producto, onVerReceta, onEditarProducto }) => {
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
        <button
          onClick={() => onVerReceta(producto)}
          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center"
          title="Ver receta"
        >
          <LuChefHat size={17} className="mr-2" /> {/* Asegura que haya un espacio entre el ícono y el texto */}
          <span className="text-sm">
            {producto.ingredientesReceta} ingrediente{producto.ingredientesReceta !== 1 ? 's' : ''}
          </span>
        </button>
      </td>
      
      {/* ACCIONES */}
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button 
            onClick={() => onEditarProducto(producto)}
            className="p-1.5 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
            title="Editar producto"
          >
            <FiEdit size={16}/>
          </button>
          <button 
            className="p-1.5 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title="Eliminar insumo"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};