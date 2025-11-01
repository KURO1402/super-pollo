// src/pages/reservas/componentes/CalendarioReservasSeccion.jsx

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { useState, useRef, useEffect } from "react";
import { FiClock, FiUsers, FiPlus, FiLoader, FiCalendar } from "react-icons/fi";

import Modal from "../../../componentes/modal/Modal";
import { useModal } from "../../../hooks/useModal";
import { estadosReserva } from "../data-temporal/mockReservas";
import FormularioReserva from "../componentes/FormularioReservas";
import { listarReservacionesServicio } from "../servicios/reservacionesServicio";

const CalendarioReservasSeccion = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const calendarioRef = useRef(null);
  const { estaAbierto, abrir, cerrar } = useModal();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);
      const reservaciones = await listarReservacionesServicio();
      setReservas(reservaciones);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      alert("Error al cargar las reservas");
    } finally {
      setCargando(false);
    }
  };

  // Función para convertir reserva a evento del calendario
  const convertirReservaAEvento = (reserva) => {
    const fecha = new Date(reserva.fechaReservacion);
    const fechaStr = fecha.toISOString().split('T')[0];
    
    return {
      id: reserva.idReservacion.toString(),
      title: `${reserva.nombresUsuario} - Mesa ${reserva.numeroMesa}`,
      start: fechaStr + 'T' + reserva.horaReservacion,
      extendedProps: {
        estado: reserva.estadoReservacion,
        hora: reserva.horaReservacion.substring(0, 5),
        cantidad: reserva.cantidadPersonas,
        mesa: reserva.numeroMesa,
        cliente: reserva.nombresUsuario
      },
      backgroundColor: getColorPorEstado(reserva.estadoReservacion),
      borderColor: getColorPorEstado(reserva.estadoReservacion),
      textColor: '#fff'
    };
  };

  const getColorPorEstado = (estado) => {
    const colores = {
      pendiente: '#f59e0b', // amber-500
      confirmada: '#10b981', // green-500
      pagado: '#059669', // green-600
      cancelado: '#ef4444', // red-500
      completada: '#6b7280' // gray-500
    };
    return colores[estado] || '#6b7280';
  };

  const obtenerEstiloEstado = (estado) => {
    const config = estadosReserva[estado] || estadosReserva.pendiente;
    const estilos = {
      yellow: {
        bg: "bg-yellow-50",
        border: "border-l-4 border-yellow-500",
        text: "text-yellow-900",
        badge: "bg-yellow-200 text-yellow-800",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-l-4 border-blue-500",
        text: "text-blue-900",
        badge: "bg-blue-200 text-blue-800",
      },
      green: {
        bg: "bg-green-50",
        border: "border-l-4 border-green-500",
        text: "text-green-900",
        badge: "bg-green-200 text-green-800",
      },
      red: {
        bg: "bg-red-50",
        border: "border-l-4 border-red-500",
        text: "text-red-900",
        badge: "bg-red-200 text-red-800",
      },
      gray: {
        bg: "bg-gray-50",
        border: "border-l-4 border-gray-500",
        text: "text-gray-900",
        badge: "bg-gray-200 text-gray-800",
      },
    };
    return estilos[config.color] || estilos.yellow;
  };

  const abrirNuevaReserva = () => {
    setReservaSeleccionada(null);
    abrir();
  };

  const manejarSeleccionFecha = (info) => {
    const fechaSel = new Date(info.startStr);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSel < hoy) {
      alert("No se pueden reservar fechas anteriores a hoy");
      return;
    }

    setReservaSeleccionada({ 
      fechaReservacion: info.startStr.split('T')[0],
      horaReservacion: '12:00:00'
    });
    abrir();
  };

  const manejarClickEvento = (info) => {
    const reserva = reservas.find((r) => r.idReservacion.toString() === info.event.id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      abrir();
    }
  };

  const manejarGuardar = async (datos) => {
    try {
      setGuardando(true);

      // Aquí iría la llamada al servicio para crear/actualizar reserva
      // Por ahora, simulamos la actualización del estado local
      
      if (reservaSeleccionada?.idReservacion) {
        console.log('Actualizando reserva:', datos);
        // await actualizarReservacionServicio(reservaSeleccionada.idReservacion, datos);
        setReservas((prev) => prev.map((r) => 
          r.idReservacion === reservaSeleccionada.idReservacion ? { ...r, ...datos } : r
        ));
        alert("Reserva actualizada exitosamente");
      } else {
        console.log('Creando nueva reserva:', datos);
        // await crearReservacionServicio(datos);
        const nuevaReserva = {
          ...datos,
          idReservacion: Date.now(),
          fechaCreacion: new Date().toISOString(),
          nombresUsuario: datos.nombreCliente || 'Cliente Nuevo'
        };
        setReservas((prev) => [...prev, nuevaReserva]);
        alert("Reserva creada exitosamente");
      }

      cerrar();
      setReservaSeleccionada(null);
    } catch (error) {
      console.error('Error al guardar reserva:', error);
      alert("Error al guardar la reserva");
    } finally {
      setGuardando(false);
    }
  };

  const renderizarEvento = (info) => {
    const estado = info.event.extendedProps?.estado || "pendiente";
    const estilos = obtenerEstiloEstado(estado);
    const config = estadosReserva[estado];

    return (
      <div className={`p-1.5 rounded ${estilos.bg} ${estilos.border} ${estilos.text} text-[11px] font-medium shadow-sm hover:shadow transition-all cursor-pointer`}>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="truncate font-semibold text-xs">{info.event.title}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${estilos.badge}`}>
            {config?.label || estado}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] opacity-90">
          <span className="flex items-center gap-0.5">
            <FiClock className="w-3 h-3" />
            {info.event.extendedProps?.hora}
          </span>
          <span className="flex items-center gap-0.5">
            <FiUsers className="w-3 h-3" />
            {info.event.extendedProps?.cantidad}
          </span>
        </div>
      </div>
    );
  };

  const eventosCalendario = reservas
    .filter(r => r.estadoReservacion !== "cancelado")
    .map(convertirReservaAEvento);

  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <FiCalendar className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario de Reservas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Visualiza y gestiona todas las reservas programadas
        </p>
      </div>

      {/* Calendario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FiLoader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando reservas...</p>
            </div>
          </div>
        ) : (
          <div className="calendar-wrapper p-4">
            <FullCalendar
              ref={calendarioRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              headerToolbar={{
                left: "prev,next btnNuevaReserva",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={eventosCalendario}
              selectable={true}
              select={manejarSeleccionFecha}
              eventClick={manejarClickEvento}
              eventContent={renderizarEvento}
              customButtons={{
                btnNuevaReserva: {
                  text: "+ Nueva Reserva",
                  click: abrirNuevaReserva,
                },
              }}
              validRange={{ start: fechaMinima }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}
              height="auto"
              dayMaxEvents={3}
              moreLinkContent={(args) => `+${args.num} más`}
              
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        estaAbierto={estaAbierto}
        onCerrar={cerrar}
        titulo={reservaSeleccionada?.idReservacion ? `Editar Reserva #${reservaSeleccionada.idReservacion}` : "Nueva Reserva"}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <FormularioReserva
          reservaInicial={reservaSeleccionada}
          reservas={reservas}
          onSubmit={manejarGuardar}
          onCancelar={cerrar}
          guardando={guardando}
        />
      </Modal>
    </div>
  );
};

export default CalendarioReservasSeccion;