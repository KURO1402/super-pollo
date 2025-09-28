import { productos } from "../data-temporal/productos";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { DetalleVenta } from "../componentes/DetalleVenta";
import { ResumenVenta } from "../componentes/ResumenVenta";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { useBusqueda } from "../../hooks/useBusqueda";

const SeccionVentas = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { subtotal, impuesto, total } = useVentaEstadoGlobal();

  let filtrados = filtrarPorBusqueda(productos, [
    "nombre"
  ]);
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Punto de Venta</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestión de detalle de ventas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-3">
            <BarraBusqueda
              valor={terminoBusqueda} 
              onChange={setTerminoBusqueda}
              placeholder="Buscar por producto..."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 h-110 overflow-y-scroll">
            {filtrados.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <DetalleVenta />
          <ResumenVenta 
            subtotal={subtotal()}
            impuesto={impuesto()}
            total={total()}
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionVentas;
