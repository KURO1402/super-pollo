import { FiPlus, FiMinus } from "react-icons/fi";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

export const TarjetaProducto = ({ producto }) => {
  // extraemos las funciones y el estado global de useVentaEstadoGlobal
  const { agregarProducto} = useVentaEstadoGlobal((state) => state);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {producto.nombre}
        </h3>
        <p className="text-lg font-bold text-blue-600 mt-1">
          S/ {producto.precio}
        </p>
      </div>
      <button
      // para agregar el producto al detalle de la venta
        onClick={() => agregarProducto(producto)}
        className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center cursor-pointer"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};
