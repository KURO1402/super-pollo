import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

export const TarjetaProducto = ({ producto }) => {
  // extraemos las funciones y el estado global de useVentaEstadoGlobal
  const { agregarProducto } = useVentaEstadoGlobal((state) => state);

  return (
    <button
      // para agregar el producto al detalle de la venta
      onClick={() => {
        agregarProducto(producto);
      }}
      className="cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {producto.nombre}
          </h3>
          <p className="text-lg font-bold text-blue-600 mt-1">
            S/ {producto.precio.toFixed(2)}
          </p>
        </div>
      </div>
    </button>
  );
};
