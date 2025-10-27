import { useEffect } from "react";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useCaja } from "../hooks/useCaja";

// Componentes modulares
import ResumenCaja from "../componentes/ResumenCaja";
import AccionesCaja from "../componentes/AccionesCaja";
import TablaMovimientos from "../componentes/TablaMovimientos";
import ModalAbrirCaja from "../componentes/ModalAbrirCaja";
import ModalIngreso from "../componentes/ModalIngreso";
import ModalEgreso from "../componentes/ModalEgreso";
import ModalArqueo from "../componentes/ModalArqueo";


const CajaActualSeccion = () => {
  const {
    caja,
    loading,
    error,
    cargarDatosCaja,
    handleAbrirCaja,
    handleCerrarCaja,
    handleRegistrarIngreso,
    handleRegistrarEgreso,
    handleRegistrarArqueo,
    limpiarError,
    cajaAbierta
  } = useCaja();

  // Hooks
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(5);
  const modalAbrirCaja = useModal();
  const modalIngreso = useModal();
  const modalEgreso = useModal();
  const modalArqueo = useModal();

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosCaja();
  }, []);

  // Funciones de utilidad
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Funciones principales
  const onAbrirCaja = async (data) => {
    try {
      await handleAbrirCaja(data.montoInicial);
      modalAbrirCaja.cerrar();
    } catch (error) {
      console.error("Error al abrir caja:", error);
    }
  };

  const onCerrarCaja = async () => {
    try {
      await handleCerrarCaja();
    } catch (error) {
      console.error("Error al cerrar caja:", error);
    }
  };

  const onRegistrarIngreso = async (data) => {
    try {
      await handleRegistrarIngreso(data);
      modalIngreso.cerrar();
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
    }
  };

  const onRegistrarEgreso = async (data) => {
    try {
      await handleRegistrarEgreso(data);
      modalEgreso.cerrar();
    } catch (error) {
      console.error("Error al registrar egreso:", error);
    }
  };

  const onRegistrarArqueo = async (data) => {
    try {
      await handleRegistrarArqueo(data);
      modalArqueo.cerrar();
    } catch (error) {
      console.error("Error al registrar arqueo:", error);
    }
  };

  // Paginación
  const { datosPaginados: movimientosPaginados, totalPaginas } = paginar(caja.movimientos);

  return (
    <div className="w-full mx-auto p-2 space-y-6">

      {/* Componentes modulares */}
      <ResumenCaja
        caja={caja}
        formatCurrency={formatCurrency}
        onAbrirCaja={modalAbrirCaja.abrir}
        onCerrarCaja={onCerrarCaja}
        loading={loading}
      />

      <AccionesCaja
        cajaAbierta={cajaAbierta}
        onIngreso={modalIngreso.abrir}
        onEgreso={modalEgreso.abrir}
        onArqueo={modalArqueo.abrir}
        loading={loading}
      />

      <TablaMovimientos
        movimientos={movimientosPaginados}
        formatCurrency={formatCurrency}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        loading={loading}
      />

      {/* Modales */}
      <ModalAbrirCaja
        estaAbierto={modalAbrirCaja.estaAbierto}
        onCerrar={modalAbrirCaja.cerrar}
        onAbrirCaja={onAbrirCaja}
        loading={loading}
      />

      <ModalIngreso
        estaAbierto={modalIngreso.estaAbierto}
        onCerrar={modalIngreso.cerrar}
        onRegistrarIngreso={onRegistrarIngreso}
        loading={loading}
      />

      <ModalEgreso
        estaAbierto={modalEgreso.estaAbierto}
        onCerrar={modalEgreso.cerrar}
        onRegistrarEgreso={onRegistrarEgreso}
        loading={loading}
      />

      <ModalArqueo
        estaAbierto={modalArqueo.estaAbierto}
        onCerrar={modalArqueo.cerrar}
        onRegistrarArqueo={onRegistrarArqueo}
        saldoActual={caja.saldoActual}
        loading={loading}
      />
    </div>
  );
};

export default CajaActualSeccion;