import { FiAlertCircle } from "react-icons/fi";
import Modal from "../../../componentes/modal/Modal";

const ModalDetalleArqueos = ({
  estaAbierto,
  onCerrar,
  arqueosCaja,
  movimientosCaja,
  loadingArqueos,
  loadingMovimientos,
  formatCurrency
}) => {
  const tieneArqueos = arqueosCaja && arqueosCaja.length > 0;
  const tieneMovimientos = movimientosCaja && movimientosCaja.length > 0;
  const arqueo = tieneArqueos ? arqueosCaja[0] : null;

  // funcion para calcular total de ingresos
  const calcularTotalIngresos = () => {
    if (!tieneMovimientos) return 0;
    return movimientosCaja
      .filter(mov => mov.tipoMovimiento?.toLowerCase() === "ingreso")
      .reduce((total, mov) => total + (parseFloat(mov.montoMovimiento) || 0), 0);
  };

  // funcion para calcular total de egresos
  const calcularTotalEgresos = () => {
    if (!tieneMovimientos) return 0;
    return movimientosCaja
      .filter(mov => mov.tipoMovimiento?.toLowerCase() === "egreso")
      .reduce((total, mov) => total + (parseFloat(mov.montoMovimiento) || 0), 0);
  };

  const totalIngresos = calcularTotalIngresos();
  const totalEgresos = calcularTotalEgresos();

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={onCerrar}
      titulo={arqueo ? `Detalle de Arqueo - ${arqueo.fechaCaja}` : "Detalle de Caja"}
      tamaño="xl"
      mostrarHeader
      mostrarFooter={false}
    >
      <div className="p-6 space-y-6">
        {loadingArqueos || loadingMovimientos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando detalles de la caja...</p>
          </div>
        ) : (
          <>
            {/* resumen de los arqueos si existe un arqueo */}
            {tieneArqueos && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen del Arqueo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
                    <p className="font-medium text-gray-900 dark:text-white">{arqueo.nombreUsuario}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="font-medium text-gray-900 dark:text-white">{arqueo.fechaCaja}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                    <p className="font-medium text-gray-900 dark:text-white">{arqueo.horaArqueo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      arqueo.estadoCaja === "cuadra"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : arqueo.estadoCaja === "sobra"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {arqueo.estadoCaja === "cuadra" ? "Cuadrada" : 
                       arqueo.estadoCaja === "sobra" ? "Sobrante" : "Faltante"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desglose de Montos solo si hay arqueos */}
            {tieneArqueos && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Desglose de Montos
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Concepto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Efectivo Físico
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.montoFisico)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Tarjetas
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.montoTarjeta)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Billetera Digital
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.montoBilleteraDigital)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Otros Medios
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.otros)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                          Diferencia
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold ${
                          parseFloat(arqueo.diferencia) > 0 
                            ? "text-green-700 dark:text-green-400" 
                            : parseFloat(arqueo.diferencia) < 0 
                            ? "text-red-700 dark:text-red-400" 
                            : "text-gray-700 dark:text-gray-400"
                        }`}>
                          {parseFloat(arqueo.diferencia) > 0 ? '+' : ''}{formatCurrency(arqueo.diferencia)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resumen de movimientos */}
            {tieneMovimientos && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Resumen de Movimientos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Ingresos</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(totalIngresos)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Egresos</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalEgresos)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Neto</p>
                    <p className={`text-lg font-bold ${
                      (totalIngresos - totalEgresos) >= 0 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {formatCurrency(totalIngresos - totalEgresos)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Movimientos de caja solo si hay movimientos */}
            {tieneMovimientos ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Movimientos de Caja ({movimientosCaja.length})
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha/Hora
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {movimientosCaja.map((movimiento) => (
                        <tr key={movimiento.id}>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              movimiento.tipoMovimiento?.toLowerCase() === "ingreso" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {movimiento.tipoMovimiento === "ingreso" ? "Ingreso" : "Egreso"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {movimiento.descripcionMovCaja || "Sin descripción"}
                          </td>
                          <td className={`px-6 py-4 text-sm font-medium ${
                            movimiento.tipoMovimiento?.toLowerCase() === "ingreso" 
                              ? "text-green-700 dark:text-green-400" 
                              : "text-red-700 dark:text-red-400"
                          }`}>
                            {movimiento.tipoMovimiento?.toLowerCase() === "ingreso" ? "+" : "-"}{formatCurrency(movimiento.montoMovimiento)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {movimiento.fecha} {movimiento.hora}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              !tieneArqueos && (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles para esta caja</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalDetalleArqueos;