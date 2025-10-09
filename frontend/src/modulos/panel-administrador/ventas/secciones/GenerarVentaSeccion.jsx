import { productos } from "../data-temporal/productos";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { DetalleVenta } from "../componentes/DetalleVenta";
import { ResumenVenta } from "../componentes/ResumenVenta";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { useBusqueda } from "../../hooks/useBusqueda";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SeccionVentas = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { subtotal, impuesto, total } = useVentaEstadoGlobal();
  const [ botonActivo, setBotonActivo ] = useState(1)
  const navigate = useNavigate()

  const handleClick = (buttonId) => {
    setBotonActivo(buttonId);
  }

  let filtrados = filtrarPorBusqueda(productos, [
    "nombre"
  ]);
  return (
    <div className="p-2">
      <div className="mb-4 flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Punto de Venta</h1>
        <FiShoppingCart className="text-2xl text-blue-500" />
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
          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
            {filtrados.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 border-b border-gray-200 dark:border-gray-700 pb-4 lg:pb-0">
            <div className="flex w-full lg:w-auto">
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  botonActivo === 1 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => handleClick(1)}
              >
              Boleta
              </button>
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  botonActivo === 2 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => handleClick(2)}
              >
                Factura
              </button>
            </div>
            <div className="w-full lg:w-auto lg:ml-auto">
              <input
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-48 xl:w-56"
                value={botonActivo === 1 ? "B001" : "F001"}
                disabled
              />
            </div>
          </div>
          <div className="py-2">
            <div className="flex gap-2 w-full">
              <input
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value="Clientes Varios"
                disabled
              />
              <button 
              onClick={() => navigate('/admin/nuevo-comprobante')}
              className="w-20 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200 flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="py-2">
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Pago
                </label>
                <select className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors duration-200">
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Pago
                </label>
                <select className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors duration-200">
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors duration-200 resize-vertical"
                  placeholder="Observaciones..."
                />
              </div>
            </div>
          </div>
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
