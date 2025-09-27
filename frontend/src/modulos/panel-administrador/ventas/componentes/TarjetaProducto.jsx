import { FiPlus, FiMinus } from "react-icons/fi";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

export const TarjetaProducto = ({ producto }) => {
  // extraemos las funciones y el estado global de useVentaEstadoGlobal
  const { cantidades, aumentarCantidad, disminuirCantidad, agregarProducto, setCantidad } = useVentaEstadoGlobal(state => state);

  // obtenemos la cantidad temporal del producto desde el estado global
  const cantidad = cantidades[producto.id] || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {producto.nombre}
        </h3>
        <p className="text-lg font-bold text-blue-600 mt-1">
          S/ {producto.precio}
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
         // llamamos a la funcion disminuirCantidad del estado global
          onClick={() => disminuirCantidad(producto.id)}
          disabled={cantidad === 0} // si es igual a cero deshabilitamos el boton
          className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center disabled:opacity-50"
        >
          <FiMinus size={14} />
        </button>
        <input
          value={cantidad}
          onChange={(e) => {
            const nuevaCantidad = Math.max(e.target.value, 0); // Asegurarse de que la cantidad no sea negativa
            setCantidad(producto.id, nuevaCantidad);
          }}
          className="font-bold text-lg w-5 dark:text-gray-300"
        />
        <button
        // llamamos a la funcion aumentarCantidad 
          onClick={() => aumentarCantidad(producto.id)}
          className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center"
        >
          <FiPlus size={14} />
        </button>
      </div>

      <button
      // para agregar el producto al detalle de la venta
        onClick={() => agregarProducto(producto)}
        disabled={cantidad === 0}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm"
      >
        Agregar al Detalle
      </button>
    </div>
  );
};
