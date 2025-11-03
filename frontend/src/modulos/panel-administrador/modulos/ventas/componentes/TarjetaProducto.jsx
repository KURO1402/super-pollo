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
      className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {producto.nombreProducto}
        </h3>
        <p className="font-bold text-blue-600 text-sm ">
          S/ {producto.precio}
        </p>
      </div>
    </button>
  );
};
