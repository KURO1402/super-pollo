import { FiMinus } from "react-icons/fi";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

export const DetalleVenta = () => {
    // extraemos el detalle y la funcion para remover productos del estado global
  const { detalle, removerProducto } = useVentaEstadoGlobal();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Detalle de Venta
      </h2>
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {/* si el detalle esta vacio mostramos un mensaje */}
        {detalle.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay productos agregados
          </p>
        ) : ( // caso contrario mostramos los productos del detalle
          detalle.map((item) => (
            // cada item del detalle
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.nombre}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.cantidad} x S/ {item.precio.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm dark:text-white">
                  S/ {( item.cantidad * item.precio).toFixed(2)}
                </span>
                <button
                // boton para remover el producto del detalle
                  onClick={() => removerProducto(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FiMinus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
