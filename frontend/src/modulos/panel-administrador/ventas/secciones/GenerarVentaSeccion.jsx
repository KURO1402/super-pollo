import { useState } from "react";
import { categorias } from "../data-temporal/categorias";
import { productos } from "../data-temporal/productos";
import { CategoriaFiltro } from "../componentes/CategoriaFiltro";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { DetalleVenta } from "../componentes/DetalleVenta";
import { ResumenVenta } from "../componentes/ResumenVenta";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

const SeccionVentas = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const { subtotal, impuesto, total } = useVentaEstadoGlobal();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Punto de Venta</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestión de detalle de ventas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoriaFiltro
            categorias={categorias}
            activa={categoriaActiva}
            onChange={setCategoriaActiva}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos // filtramos los productos por la categoria activa y mapeamos para crear una tarjeta por cada producto
              .filter( // si la categoria activa es "todos' mostramos todos los productos, caso contrario filtramos por la categoria
                (p) => categoriaActiva === "Todos" || p.categoria === categoriaActiva
              ) // luego mapeamos los productos filtrados
              .map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
          </div>
        </div>

        <div>
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
