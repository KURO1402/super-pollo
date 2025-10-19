import { FaCashRegister, FaUtensils, FaBoxOpen, FaCalendarAlt, FaDollarSign, FaUsers, FaChartLine } from "react-icons/fa";
import { MetricasCard } from "../componentes/MetricasCard";
import GraficoVentasEgresos from "../componentes/graficos/GraficoVentasEgresos";
import GraficoCategoriasProductos from "../componentes/graficos/GraficoCategoriasProductos";
import GraficoProductosPopulares from "../componentes/graficos/GraficoProductosPopulares";
import GraficoReservas from "../componentes/graficos/GraficoReservas";

const DashboardSeccion = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Principal */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panel de Control
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Resumen general y métricas del restaurante
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              S/ 5,226.99
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <FaChartLine size={12} />
              +12.5% vs ayer
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Columna Izquierda - Métricas y Gráficos Principales */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Cards de Métricas en 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricasCard
              titulo="Ingresos del Día"
              valor="S/ 2,480"
              cambio={+12}
              icono={FaCashRegister}
            />
            <MetricasCard
              titulo="Ventas Realizadas"
              valor="124"
              cambio={+8}
              icono={FaUtensils}
            />
            <MetricasCard
              titulo="Stock Crítico"
              valor="5 insumos"
              cambio={-2}
              icono={FaBoxOpen}
            />
            <MetricasCard
              titulo="Reservas Activas"
              valor="18"
              cambio={+3}
              icono={FaCalendarAlt}
            />
          </div>

          {/* Gráfico Principal - Ventas vs Egresos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ingresos y Egresos
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Egresos</span>
                </div>
              </div>
            </div>
            <GraficoVentasEgresos />
          </div>

          {/* Gráficos Secundarios en Grid 2x1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tendencia de Reservas
              </h3>
              <GraficoReservas />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Productos Populares
              </h3>
              <GraficoProductosPopulares />
            </div>
          </div>
        </div>

        {/* Columna Derecha - Estadísticas y Métricas Adicionales */}
        <div className="space-y-6">
          
          {/* Balance General */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Balance General
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">S/ 45,280</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Egresos Totales</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">S/ 28,150</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-semibold">Ganancia Neta</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">S/ 17,130</span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribución de Ventas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribución por Categoría
            </h3>
            <GraficoCategoriasProductos />
          </div>

          {/* Métricas Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Métricas Rápidas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaUsers className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Clientes Hoy</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">87</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaDollarSign className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Ticket Promedio</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">S/ 28.50</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <FaChartLine className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Ocupación Mesa</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">78%</span>
              </div>
            </div>
          </div>

          {/* Alertas y Notificaciones */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Alertas del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-800 dark:text-yellow-300">Stock bajo de papas</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-800 dark:text-green-300">5 nuevas reservas hoy</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-800 dark:text-blue-300">Meta de ventas alcanzada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeccion;