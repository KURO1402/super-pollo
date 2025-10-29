// librerias externas
import { FiSearch, FiDownload, FiPrinter, FiFilter, FiCheckCircle, FiAlertTriangle, FiXCircle, FiEye} from "react-icons/fi";
// hooks de react
import { useState } from "react";
// componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
// Nuestros hooks 
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useHistorialCajas } from "../hooks/useHistorialCaja";
import TablasCajasCerradas from "../componentes/TablaCajasCerradas";

const HistorialCajasSeccion = () => {
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    empleado: "",
    estado: ""
  }); // estado para los filtros
  const { 
    cajasCerradas,
    loadingCajas,
    errorCajas,
    arqueosPorCaja,
    loadingArqueos,
    errorArqueos,
    cargarArqueos,
    formatDate,
    formatCurrency
  } = useHistorialCajas();
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null); // estado para saber que caja a sido seleccionada
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(10); // para la paginación
  const { estaAbierto: modalDetalleAbierto, abrir: abrirDetalle, cerrar: cerrarDetalle } = useModal(); // uso del modal

  console.log("cajasCerradas:", cajasCerradas);

  // Aplicar filtros
  const historialFiltrado = cajasCerradas.filter(caja => {
    if (filtros.fechaInicio && caja.fecha < filtros.fechaInicio) return false;
    if (filtros.fechaFin && caja.fecha > filtros.fechaFin) return false;
    if (filtros.empleado && caja.cajero !== filtros.empleado) return false;
    if (filtros.estado && caja.estado !== filtros.estado) return false;
    return true;
  });

  // Paginar resultados filtrados
  const { datosPaginados: cajasPaginadas, totalPaginas } = paginar(historialFiltrado);

  // Manejar cambio de filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaActual(1);
  };

  // Opciones predefinidas de fechas
  const opcionesFechas = [
    { label: "Hoy", value: "hoy" },
    { label: "Ayer", value: "ayer" },
    { label: "Esta semana", value: "semana" },
    { label: "Este mes", value: "mes" },
    { label: "Mes anterior", value: "mes-anterior" }
  ];

  const aplicarOpcionFecha = (opcion) => {
    const hoy = new Date();
    let fechaInicio = "";
    let fechaFin = "";

    switch (opcion) {
      case "hoy":
        fechaInicio = hoy.toISOString().split('T')[0];//formateamos
        fechaFin = hoy.toISOString().split('T')[0];
        break;
      case "ayer":
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1); // hallamos la fecha de de ayer
        fechaInicio = ayer.toISOString().split('T')[0];
        fechaFin = ayer.toISOString().split('T')[0];
        break;
      case "semana":
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        fechaInicio = inicioSemana.toISOString().split('T')[0];
        fechaFin = hoy.toISOString().split('T')[0];
        break;
      case "mes":
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaInicio = inicioMes.toISOString().split('T')[0];
        fechaFin = hoy.toISOString().split('T')[0];
        break;
      case "mes-anterior":
        const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        fechaInicio = inicioMesAnterior.toISOString().split('T')[0];
        fechaFin = finMesAnterior.toISOString().split('T')[0];
        break;
      default:
        break;
    }

    setFiltros(prev => ({ ...prev, fechaInicio, fechaFin }));
    setPaginaActual(1);
  };

  // Imprimir reporte
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historial de Cajas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Auditoría y análisis de flujos de efectivo pasados
            </p>
          </div>
        </div>

        {/* Filtros Avanzados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Rango de Fechas - Opciones Predefinidas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de Fechas
            </label>
            <select
              onChange={(e) => aplicarOpcionFecha(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Seleccionar opción</option>
              {opcionesFechas.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha Inicio Personalizada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          {/* Fecha Fin Personalizada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Filtros Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estado de Cuadre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado de Cuadre
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => handleFiltroChange("estado", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Todos los estados</option>
              <option value="cuadrada">Cuadrada</option>
              <option value="sobrante">Con Sobrante</option>
              <option value="faltante">Con Faltante</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Historial */}
      <TablasCajasCerradas
        cajasCerradas={cajasPaginadas}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        loading={loadingCajas}
      />

      {/* Modal de Detalle */}
      <Modal
        estaAbierto={modalDetalleAbierto}
        onCerrar={cerrarDetalle}
        titulo={`Reporte Detallado - ${cajaSeleccionada ? formatDate(cajaSeleccionada.fecha) : ''}`}
        tamaño="xl"
        mostrarHeader
        mostrarFooter={false}
      >
        {cajaSeleccionada && (
          <div className="p-6 space-y-6">
            {/* Resumen de Cuadre */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumen de Cuadre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cajero</p>
                  <p className="font-medium text-gray-900 dark:text-white">{cajaSeleccionada.cajero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(cajaSeleccionada.fecha)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    cajaSeleccionada.estado === "cuadrada" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                      : cajaSeleccionada.estado === "sobrante"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {cajaSeleccionada.estado === "cuadrada" ? "Cuadrada" : 
                     cajaSeleccionada.estado === "sobrante" ? "Sobrante" : "Faltante"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Esperado</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(cajaSeleccionada.saldoEsperado)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Contado</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(cajaSeleccionada.saldoContado)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Diferencia</p>
                  <p className={`font-medium ${
                    cajaSeleccionada.diferencia > 0 
                      ? "text-green-700 dark:text-green-400" 
                      : cajaSeleccionada.diferencia < 0 
                      ? "text-red-700 dark:text-red-400" 
                      : "text-gray-700 dark:text-gray-400"
                  }`}>
                    {cajaSeleccionada.diferencia > 0 ? `+${formatCurrency(cajaSeleccionada.diferencia)}` : 
                     cajaSeleccionada.diferencia < 0 ? `${formatCurrency(cajaSeleccionada.diferencia)}` : 
                     formatCurrency(cajaSeleccionada.diferencia)}
                  </p>
                </div>
              </div>
            </div>

            {/* Desglose de Ventas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Desglose de Ventas
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo de Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {cajaSeleccionada.ventas.map((venta, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {venta.tipo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {formatCurrency(venta.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Movimientos de Caja Manuales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Movimientos de Caja Manuales
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {cajaSeleccionada.movimientos.map((movimiento, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            movimiento.tipo === "ingreso" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {movimiento.tipo === "ingreso" ? "Ingreso" : "Egreso"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {movimiento.descripcion}
                        </td>
                        <td className={`px-6 py-4 text-sm font-medium ${
                          movimiento.tipo === "ingreso" 
                            ? "text-green-700 dark:text-green-400" 
                            : "text-red-700 dark:text-red-400"
                        }`}>
                          {movimiento.tipo === "ingreso" ? "+" : "-"}{formatCurrency(movimiento.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleImprimir}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <FiPrinter className="w-4 h-4" />
                Imprimir Reporte
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistorialCajasSeccion;