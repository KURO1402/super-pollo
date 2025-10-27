import { useState, useEffect } from "react";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useAutenticacionGlobal } from "../../../../../app/estado-global/autenticacionGlobal";

// Componentes modulares
import ResumenCaja from "../componentes/ResumenCaja";
import AccionesCaja from "../componentes/AccionesCaja";
import TablaMovimientos from "../componentes/TablaMovimientos";
import ModalAbrirCaja from "../componentes/ModalAbrirCaja";
import ModalIngreso from "../componentes/ModalIngreso";
import ModalEgreso from "../componentes/ModalEgreso";
import ModalArqueo from "../componentes/ModalArqueo";

// Servicios
import { 
  abrirCajaServicio, 
  cerrarCajaServicio,
  registrarIngresoServicio,
  registrarEgresoServicio,
  registrarArqueoServicio
} from "../servicios/gestionCajaServicio";

const CajaActualSeccion = () => {
  const { accessToken } = useAutenticacionGlobal();
  const [caja, setCaja] = useState({
    estado: "cerrada",
    saldoInicial: "-",
    saldoActual: 0,
    ingresos: "-",
    egresos: "-",
    movimientos: []
  });

  // Hooks
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(5);
  const modalAbrirCaja = useModal();
  const modalIngreso = useModal();
  const modalEgreso = useModal();
  const modalArqueo = useModal();

  // Funciones de utilidad
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Funciones principales
  const handleAbrirCaja = async (data) => {
    try {
      await abrirCajaServicio({ montoInicial: Number(data.montoInicial) }, accessToken);
      setCaja(prev => ({ ...prev, estado: "abierta", saldoInicial: Number(data.montoInicial) }));
      modalAbrirCaja.cerrar();
    } catch (error) {
      console.error("Error al abrir caja:", error);
    }
  };

  const handleCerrarCaja = async () => {
    try {
      await cerrarCajaServicio(accessToken);
      setCaja(prev => ({ ...prev, estado: "cerrada" }));
    } catch (error) {
      console.error("Error al cerrar caja:", error);
    }
  };

  const handleRegistrarIngreso = async (data) => {
    try {
      await registrarIngresoServicio(data, accessToken);
      // Actualizar estado local o recargar datos
      modalIngreso.cerrar();
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
    }
  };

  const handleRegistrarEgreso = async (data) => {
    try {
      await registrarEgresoServicio(data, accessToken);
      // Actualizar estado local o recargar datos
      modalEgreso.cerrar();
    } catch (error) {
      console.error("Error al registrar egreso:", error);
    }
  };

  const handleRegistrarArqueo = async (data) => {
    try {
      await registrarArqueoServicio(data, accessToken);
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
        onCerrarCaja={handleCerrarCaja}
      />

      <AccionesCaja
        cajaAbierta={caja.estado === "abierta"}
        onIngreso={modalIngreso.abrir}
        onEgreso={modalEgreso.abrir}
        onArqueo={modalArqueo.abrir}
      />

      <TablaMovimientos
        movimientos={movimientosPaginados}
        formatCurrency={formatCurrency}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />

      {/* Modales */}
      <ModalAbrirCaja
        estaAbierto={modalAbrirCaja.estaAbierto}
        onCerrar={modalAbrirCaja.cerrar}
        onAbrirCaja={handleAbrirCaja}
      />

      <ModalIngreso
        estaAbierto={modalIngreso.estaAbierto}
        onCerrar={modalIngreso.cerrar}
        onRegistrarIngreso={handleRegistrarIngreso}
      />

      <ModalEgreso
        estaAbierto={modalEgreso.estaAbierto}
        onCerrar={modalEgreso.cerrar}
        onRegistrarEgreso={handleRegistrarEgreso}
      />

      <ModalArqueo
        estaAbierto={modalArqueo.estaAbierto}
        onCerrar={modalArqueo.cerrar}
        onRegistrarArqueo={handleRegistrarArqueo}
        saldoActual={caja.saldoActual}
      />
    </div>
  );
};

export default CajaActualSeccion;