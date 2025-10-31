// hooks de react
import { useState } from "react";
// Nuestros hooks 
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useHistorialCajas } from "../hooks/useHistorialCaja";
import TablasCajasCerradas from "../componentes/TablaCajasCerradas";
import ModalDetalleArqueos from "../componentes/ModalDetalleArqueos";

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
    arqueosCaja,
    movimientosCaja,
    loadingArqueos,
    loadingMovimientos,
    cargarDetallesCompletosCaja,
    formatDate,
    formatCurrency
  } = useHistorialCajas();

  const [ idCajaSeleccionada, setIdCajaSeleccionada] = useState(null); // estado para saber que caja a sido seleccionada
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(7); // para la paginación
  const { estaAbierto: modalDetalleAbierto, abrir: abrirDetalle, cerrar: cerrarDetalle } = useModal(); // uso del modal

  // funcion para manejar el click del ver detlle
  const handleVerDetalle = async (idCaja) => {
    try {
      setIdCajaSeleccionada(idCaja);
      await cargarDetallesCompletosCaja(idCaja);
      abrirDetalle();
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    }
  };

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
          {/* Rango de Fechas */}
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
        onVerDetalle={handleVerDetalle}
      />

      {/* Modal de Detalle */}
      <ModalDetalleArqueos
        estaAbierto={modalDetalleAbierto}
        onCerrar={cerrarDetalle}
        arqueosCaja={arqueosCaja}
        movimientosCaja={movimientosCaja}
        loadingArqueos={loadingArqueos}
        loadingMovimientos={loadingMovimientos}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default HistorialCajasSeccion;