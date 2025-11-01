// src/pages/reservas/componentes/HistorialReservasSeccion.jsx

import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
// componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda";
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
// custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda";
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
// componentes del modulo
import { ModalDetalleReserva } from "../componentes/ModalDetalleReserva";
import { ModalEditarReserva } from "../componentes/ModalEditarReserva";
import { FilaReserva } from "../componentes/FilaReserva";
// servicios
import { 
  listarReservacionesServicio,
  obtenerDetalleReservacionServicio
} from "../servicios/reservacionesServicio";

const HistorialReservasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(10);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalleReserva, setDetalleReserva] = useState(null);
  
  const modalDetalle = useModal(false);
  const modalEditar = useModal(false);

  // Cargar reservaciones al inicializar
  useEffect(() => {
    cargarReservaciones();
  }, []);

  const cargarReservaciones = async () => {
    try {
      setCargando(true);
      const reservaciones = await listarReservacionesServicio();
      setReservas(reservaciones);
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
      alert('Error al cargar las reservaciones');
    } finally {
      setCargando(false);
    }
  };

  // Cargar detalle completo de la reservación
  const cargarDetalleReserva = async (idReservacion) => {
    try {
      const detalle = await obtenerDetalleReservacionServicio(idReservacion);
      setDetalleReserva(detalle);
    } catch (error) {
      console.error('Error al cargar detalle de reservación:', error);
      setDetalleReserva(null);
    }
  };

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(reservas, [
    "nombresUsuario",
    "numeroMesa",
    "estadoReservacion"
  ]);

  // Aplicar filtros por estado
  filtrados = aplicarFiltros(filtrados, "estadoReservacion");
  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Función para actualizar reserva
  const handleActualizarReserva = async (datosActualizados) => {
    try {
      // Aquí iría la llamada al servicio de actualización
      // await actualizarReservacionServicio(datosActualizados.idReservacion, datosActualizados);
      
      // Por ahora, actualizamos el estado local
      setReservas(prevReservas => 
        prevReservas.map(reserva => 
          reserva.idReservacion === datosActualizados.idReservacion 
            ? { ...reserva, ...datosActualizados }
            : reserva
        )
      );
      
      alert('Reserva actualizada correctamente');
      modalEditar.cerrar();
      
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      alert('Error al actualizar la reserva');
    }
  };

  // Función para cancelar reserva
  const handleCancelarReserva = async (reserva) => {
    if (confirm(`¿Estás seguro de cancelar la reserva #${reserva.idReservacion}?`)) {
      try {
        
        setReservas(prevReservas => 
          prevReservas.map(r => 
            r.idReservacion === reserva.idReservacion 
              ? { ...r, estadoReservacion: 'cancelado' }
              : r
          )
        );
        
        alert('Reserva cancelada correctamente');
        
      } catch (error) {
        console.error('Error al cancelar reserva:', error);
        alert('Error al cancelar la reserva');
      }
    }
  };

  const handleVerDetalle = async (reserva) => {
    setReservaSeleccionada(reserva);
    await cargarDetalleReserva(reserva.idReservacion);
    modalDetalle.abrir();
  };

  const handleEditar = (reserva) => {
    setReservaSeleccionada(reserva);
    modalEditar.abrir();
  };

  const filasReservas = datosPaginados.map((reserva) => (
    <FilaReserva 
      key={reserva.idReservacion} 
      reserva={reserva}
      onVerDetalle={handleVerDetalle}
      onEditar={handleEditar}
      onCancelar={handleCancelarReserva}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <FaCalendarAlt className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Reservas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gestión y control de todas las reservas del restaurante
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por cliente, mesa o estado..."
          />
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro}
            opciones={[
              { value: "todos", label: "Todas las reservas" },
              { value: "pagado", label: "Pagadas" },
              { value: "pendiente", label: "Pendientes" },
              { value: "cancelado", label: "Canceladas" },
            ]}
          />
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando reservas...</p>
        </div>
      ) : (
        <>
          {/* Tabla de reservas */}
          <Tabla
            encabezados={["Reserva", "Cliente", "Detalles", "Estado", "Fecha", "Acciones"]}
            registros={filasReservas}
          />

          {datosPaginados.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {reservas.length === 0 ? "No hay reservas registradas" : "No se encontraron reservas que coincidan con la búsqueda"}
            </div>
          )}

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={setPaginaActual}
          />
        </>
      )}

      {/* Modal de detalle */}
      <Modal
        estaAbierto={modalDetalle.estaAbierto}
        onCerrar={modalDetalle.cerrar}
        titulo={`Detalle de Reserva #${reservaSeleccionada?.idReservacion || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalDetalleReserva 
          reserva={reservaSeleccionada}
          detalle={detalleReserva}
          onClose={modalDetalle.cerrar}
        />
      </Modal>

      {/* Modal de edición */}
      <Modal
        estaAbierto={modalEditar.estaAbierto}
        onCerrar={modalEditar.cerrar}
        titulo={`Editar Reserva #${reservaSeleccionada?.idReservacion || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {reservaSeleccionada && (
          <ModalEditarReserva 
            reserva={reservaSeleccionada}
            onClose={modalEditar.cerrar}
            onGuardar={handleActualizarReserva}
          />
        )}
      </Modal>
    </div>
  );
};

export default HistorialReservasSeccion;