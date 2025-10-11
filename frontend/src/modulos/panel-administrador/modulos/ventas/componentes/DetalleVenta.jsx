import { FiMinus } from "react-icons/fi";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

export const DetalleVenta = () => {
  const { detalle, removerProducto } = useVentaEstadoGlobal(); // vamos a usar el las funciones de detalle y remover productos
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Detalle de Venta
      </h2> 
      {detalle.length === 0 ? ( // si no hay productos mostramos esto
        <p className="text-gray-500 text-center py-8">
          No hay productos agregados
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Precio Unit.</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody> 
              {detalle.map((item) => ( // mapeamos todos los productos para mostrar las filas 
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <td className="px-4 py-2 dark:text-gray-200">{item.cantidad}</td> 
                  <td className="px-4 py-2 dark:text-gray-200">{item.nombre}</td>
                  <td className="px-4 py-2 text-right dark:text-gray-200">
                    S/ {item.precio.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold dark:text-gray-200">
                    S/ {(item.cantidad * item.precio).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removerProducto(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiMinus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
