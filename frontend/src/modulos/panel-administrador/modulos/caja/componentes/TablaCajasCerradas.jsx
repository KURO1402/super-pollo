import { FiFilter, FiSearch } from "react-icons/fi";
import { Tabla } from "../../../componentes/tabla/Tabla";
import FilaCajasCerradas from "./FilaCajasCerradas";
import { Paginacion } from "../../../componentes/tabla/Paginacion";

const TablasCajasCerradas = ({cajasCerradas, formatCurrency, paginaActual, totalPaginas, onCambiarPagina, abrirDetalle, setCajaSeleccionada }) => {
  // Encabezados para la tabla
  const encabezados = ["Fecha", "Cajero", "Saldo Esperado", "Saldo Contado", "Diferencia", "Estado", "Acciones"];

  const registros = cajasCerradas.map((cajaCerrada) => (
    <FilaCajasCerradas
      key={cajaCerrada.idCaja}
      cajaCerrada={cajaCerrada} 
      formatCurrency={formatCurrency}
      abrirDetalle = {abrirDetalle}
      handleCajaAbierta = {cajaCerrada}
      setCajaSeleccionada = {setCajaSeleccionada}
    />
  )); 

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resumen de Cajas Cerradas
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({cajasCerradas.length} registros)
          </span>
        </div>
      </div>

      {cajasCerradas.length > 0 ? (
        <>
          <Tabla encabezados={encabezados} registros={registros} />
          {totalPaginas > 1 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              alCambiarPagina={onCambiarPagina}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron registros
          </p>
        </div>
      )}
    </div>
  );
};
export default TablasCajasCerradas;
