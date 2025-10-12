// importamos librerias externas
import { useForm } from "react-hook-form";
import { FiPlus, FiMinus, FiFilter,FiDollarSign,FiTrendingUp,FiTrendingDown,FiClock,FiCheckCircle,FiXCircle,FiLock} from "react-icons/fi";
// hooks de react
import { useState } from "react";
// componentes reutilizables que creamos
import { Tabla } from "../../../componentes/tabla/Tabla";
import Modal from "../../../componentes/modal/Modal";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
// custom hooks que creamos
import { useModal } from "../../../hooks/useModal";
import { usePaginacion } from "../../../hooks/usePaginacion";
// los componentes propios de este módulo 
import FilaMovimientos from "../componentes/FilaMovimientos";

const CajaActualSeccion = () => {
  const [caja, setCaja] = useState({
    estado: "abierta",
    saldoInicial: 1500.00,
    ingresos: 850.75,
    egresos: 320.25,
    movimientos: [
      {
        id: 1,
        tipo: "ingreso",
        monto: 250.00,
        descripcion: "Venta contado - Mesa living",
        fecha: "2024-01-15T10:30:00",
        usuario: "María González"
      },
      {
        id: 2,
        tipo: "egreso",
        monto: 120.50,
        descripcion: "Compra materiales",
        fecha: "2024-01-15T11:15:00",
        usuario: "Carlos López"
      },
      {
        id: 3,
        tipo: "ingreso",
        monto: 600.75,
        descripcion: "Pago cliente corporativo",
        fecha: "2024-01-15T14:20:00",
        usuario: "Ana Martínez"
      },
      {
        id: 4,
        tipo: "egreso",
        monto: 199.75,
        descripcion: "Pago servicios",
        fecha: "2024-01-15T16:45:00",
        usuario: "Pedro Sánchez"
      },
      {
        id: 5,
        tipo: "ingreso",
        monto: 350.00,
        descripcion: "Venta mostrador",
        fecha: "2024-01-15T17:30:00",
        usuario: "Laura Ramírez"
      }
    ]
  });

  const { paginaActual, setPaginaActual, paginar } = usePaginacion(5); // para el hook de paginación
  // para poder utilizar el modal de registrar un nuevo ingreso
  const { 
    estaAbierto: modalIngresoAbierto, 
    abrir: abrirIngreso, 
    cerrar: cerrarIngreso 
  } = useModal();
  // lo mismo para los egresos
  const { 
    estaAbierto: modalEgresoAbierto, 
    abrir: abrirEgreso, 
    cerrar: cerrarEgreso 
  } = useModal();
  // utilizar react-hook-form con las funciones que hicimos para simplificar y llevar un mejor control de ambos formularios
  const { register: registerIngreso, handleSubmit: handleSubmitIngreso, reset: resetIngreso } = useForm();
  const { register: registerEgreso, handleSubmit: handleSubmitEgreso, reset: resetEgreso } = useForm();

  // Calcular saldo actual
  const saldoActual = caja.saldoInicial + caja.ingresos - caja.egresos;

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Paginar movimientos
  const { datosPaginados: movimientosPaginados, totalPaginas } = paginar(caja.movimientos);

  // Encabezados para la tabla
  const encabezados = ["Tipo", "Descripción", "Monto", "Fecha", "Usuario"];

  // Renderizar filas de movimientos
  const registros = movimientosPaginados.map((movimiento) => (
    <FilaMovimientos 
      key={movimiento.id}
      movimiento={movimiento} 
      formatCurrency={formatCurrency}
    />
  ));

  const onSubmitIngreso = (data) => {
    const nuevoMovimiento = {
      id: Date.now(),
      tipo: "ingreso",
      monto: parseFloat(data.monto),
      descripcion: data.descripcion,
      fecha: new Date().toISOString(),
      usuario: "Usuario Actual"
    };

    setCaja(prev => ({
      ...prev,
      ingresos: prev.ingresos + nuevoMovimiento.monto,
      movimientos: [nuevoMovimiento, ...prev.movimientos]
    }));

    resetIngreso();
    cerrarIngreso();
    setPaginaActual(1); // Volver a la primera página al agregar nuevo movimiento
  };

  const onSubmitEgreso = (data) => {
    const nuevoMovimiento = {
      id: Date.now(),
      tipo: "egreso",
      monto: parseFloat(data.monto),
      descripcion: data.descripcion,
      fecha: new Date().toISOString(),
      usuario: "Usuario Actual"
    };

    setCaja(prev => ({
      ...prev,
      egresos: prev.egresos + nuevoMovimiento.monto,
      movimientos: [nuevoMovimiento, ...prev.movimientos]
    }));

    resetEgreso();
    cerrarEgreso();
    setPaginaActual(1); // Volver a la primera página al agregar nuevo movimiento
  };

  const handleCerrarCaja = () => {
    setCaja(prev => ({
      ...prev,
      estado: "cerrada"
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Cabecera de Resumen */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Caja Actual
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Control y gestión de movimientos financieros
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              caja.estado === "abierta" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {caja.estado === "abierta" ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiXCircle className="w-5 h-5" />
              )}
              <span className="font-medium capitalize">{caja.estado}</span>
            </div>
            
            {caja.estado === "abierta" && (
              <button
                onClick={handleCerrarCaja}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                <FiLock className="w-4 h-4" />
                Cerrar Caja
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Saldo Inicial */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Inicial</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(caja.saldoInicial)}
                </p>
              </div>
            </div>
          </div>

          {/* Ingresos */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Ingresos</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">
                  +{formatCurrency(caja.ingresos)}
                </p>
              </div>
            </div>
          </div>

          {/* Egresos */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <FiTrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Egresos</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-400">
                  -{formatCurrency(caja.egresos)}
                </p>
              </div>
            </div>
          </div>

          {/* Saldo Actual */}
          <div className={`rounded-lg p-4 ${
            saldoActual >= 0 
              ? "bg-emerald-50 dark:bg-emerald-900/20" 
              : "bg-red-50 dark:bg-red-900/20"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                saldoActual >= 0 
                  ? "bg-emerald-100 dark:bg-emerald-900/30" 
                  : "bg-red-100 dark:bg-red-900/30"
              }`}>
                <FiDollarSign className={`w-6 h-6 ${
                  saldoActual >= 0 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-red-600 dark:text-red-400"
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Actual</p>
                <p className={`text-xl font-bold ${
                  saldoActual >= 0 
                    ? "text-emerald-700 dark:text-emerald-400" 
                    : "text-red-700 dark:text-red-400"
                }`}>
                  {formatCurrency(saldoActual)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solo Botones de Acción (sin filtros) */}
      <div className="flex justify-end">
        <div className="flex gap-3">
          <button
            onClick={abrirIngreso}
            disabled={caja.estado === "cerrada"}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Registrar Ingreso
          </button>
          <button
            onClick={abrirEgreso}
            disabled={caja.estado === "cerrada"}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
          >
            <FiMinus className="w-4 h-4" />
            Registrar Egreso
          </button>
        </div>
      </div>

      {/* Tabla de Movimientos con Componente Reutilizable */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiClock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Movimientos Recientes
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({caja.movimientos.length} movimientos)
            </span>
          </div>
        </div>
        {caja.movimientos.length > 0 ? (
          <>
            <Tabla
              encabezados={encabezados}
              registros={registros}
            />
            {totalPaginas > 1 && (
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                alCambiarPagina={setPaginaActual}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FiFilter className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No se encontraron movimientos</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal
        estaAbierto={modalIngresoAbierto}
        onCerrar={cerrarIngreso}
        titulo="Registrar Ingreso"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <form onSubmit={handleSubmitIngreso(onSubmitIngreso)} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                {...registerIngreso("monto", { 
                  required: "El monto es requerido",
                  min: { value: 0.01, message: "El monto debe ser mayor a 0" }
                })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                {...registerIngreso("descripcion", { required: "La descripción es requerida" })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                placeholder="Describe el origen de este ingreso..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={cerrarIngreso}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200"
            >
              Registrar Ingreso
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        estaAbierto={modalEgresoAbierto}
        onCerrar={cerrarEgreso}
        titulo="Registrar Egreso"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <form onSubmit={handleSubmitEgreso(onSubmitEgreso)} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                {...registerEgreso("monto", { 
                  required: "El monto es requerido",
                  min: { value: 0.01, message: "El monto debe ser mayor a 0" }
                })}
                className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                {...registerEgreso("descripcion", { required: "La descripción es requerida" })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                placeholder="Describe el destino de este egreso..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={cerrarEgreso}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
            >
              Registrar Egreso
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CajaActualSeccion;