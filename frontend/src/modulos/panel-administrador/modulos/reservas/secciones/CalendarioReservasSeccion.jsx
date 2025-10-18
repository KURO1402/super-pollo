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
import { mockReservas, estadosReserva } from "../data-temporal/mockReservas";
import { convertirReservaAEvento, validarDisponibilidadMesa } from "../utilidades/ValidacionesReservaciones";
import FormularioReserva from "../componentes/FormularioReservas";

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
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Cargando reservas desde el backend...');
      setReservas(mockReservas);
      console.log('Reservas cargadas:', mockReservas.length);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      alert("Error al cargar las reservas");
    } finally {
      setCargando(false);
    }
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

    setReservaSeleccionada({ fechaReserva: info.startStr });
    abrir();
  };

  const manejarClickEvento = (info) => {
    const reserva = reservas.find((r) => r.id === info.event.id);
    if (reserva) {
      setReservaSeleccionada(reserva);
      abrir();
    }
  };

  const manejarGuardar = async (datos) => {
    try {
      setGuardando(true);

      const datosSanitizados = {
        ...datos,
        nombreCliente: datos.nombreCliente.trim(),
        telefono: datos.telefono?.trim() || "",
        comentarios: datos.comentarios?.trim() || "",
      };

      // Validar disponibilidad
      if (!validarDisponibilidadMesa(
        reservas,
        datosSanitizados.fechaReserva,
        datosSanitizados.horaReserva,
        datosSanitizados.numeroMesa,
        reservaSeleccionada?.id
      )) {
        alert("La mesa no está disponible en ese horario");
        setGuardando(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 600));

      if (reservaSeleccionada?.id) {
        console.log('Actualizando reserva en el backend:', datosSanitizados);
        const nuevaReserva = { ...datosSanitizados, id: reservaSeleccionada.id };
        setReservas((prev) => prev.map((r) => (r.id === reservaSeleccionada.id ? nuevaReserva : r)));
        console.log('Reserva actualizada exitosamente');
        alert("Reserva actualizada exitosamente");
      } else {
        console.log('Creando nueva reserva en el backend:', datosSanitizados);
        const nuevaReserva = {
          ...datosSanitizados,
          id: Date.now().toString(),
          fechaCreacion: new Date().toISOString(),
        };
        setReservas((prev) => [...prev, nuevaReserva]);
        console.log('Reserva creada exitosamente');
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
            {config.label}
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
    .filter(r => r.estado !== "cancelado")
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
        titulo={reservaSeleccionada?.id ? `Editar Reserva #${reservaSeleccionada.id}` : "Nueva Reserva"}
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

      <style jsx>{`
        .calendar-wrapper :global(.fc) {
          background: transparent;
        }
        
        .calendar-wrapper :global(.fc .fc-toolbar-title) {
          font-size: 1.25rem;
          font-weight: 700;
          color: rgb(17 24 39);
        }
        
        .calendar-wrapper :global(.dark .fc .fc-toolbar-title) {
          color: rgb(243 244 246);
        }
        
        .calendar-wrapper :global(.fc-theme-standard th) {
          background: transparent;
          border-color: rgb(229 231 235);
        }
        
        .calendar-wrapper :global(.dark .fc-theme-standard th) {
          border-color: rgb(55 65 81);
        }
        
        .calendar-wrapper :global(.fc-theme-standard td) {
          border-color: rgb(229 231 235);
        }
        
        .calendar-wrapper :global(.dark .fc-theme-standard td) {
          border-color: rgb(55 65 81);
        }
        
        .calendar-wrapper :global(.fc .fc-daygrid-day-number) {
          color: rgb(17 24 39);
          padding: 0.5rem;
          font-weight: 500;
        }
        
        .calendar-wrapper :global(.dark .fc .fc-daygrid-day-number) {
          color: rgb(243 244 246);
        }
        
        .calendar-wrapper :global(.fc .fc-col-header-cell-cushion) {
          color: rgb(75 85 99);
          font-weight: 600;
          padding: 0.75rem 0.5rem;
        }
        
        .calendar-wrapper :global(.dark .fc .fc-col-header-cell-cushion) {
          color: rgb(209 213 219);
        }
        
        .calendar-wrapper :global(.fc .fc-button-primary) {
          background-color: rgb(37 99 235);
          border-color: rgb(37 99 235);
          color: #ffffff;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        
        .calendar-wrapper :global(.fc .fc-button-primary:hover) {
          background-color: rgb(29 78 216);
          border-color: rgb(29 78 216);
        }
        
        .calendar-wrapper :global(.fc .fc-button-primary:not(:disabled):active),
        .calendar-wrapper :global(.fc .fc-button-primary:not(:disabled).fc-button-active) {
          background-color: rgb(30 64 175);
          border-color: rgb(30 64 175);
        }
        
        .calendar-wrapper :global(.fc .fc-daygrid-day:hover) {
          background-color: rgb(249 250 251);
        }
        
        .calendar-wrapper :global(.dark .fc .fc-daygrid-day:hover) {
          background-color: rgb(31 41 55 / 0.5);
        }
        
        .calendar-wrapper :global(.fc .fc-daygrid-day.fc-day-today) {
          background-color: rgb(219 234 254 / 0.3) !important;
        }
        
        .calendar-wrapper :global(.dark .fc .fc-daygrid-day.fc-day-today) {
          background-color: rgb(30 58 138 / 0.2) !important;
        }
        
        .calendar-wrapper :global(.fc-event) {
          border: none !important;
          background: none !important;
        }

        .calendar-wrapper :global(.fc .fc-more-link) {
          color: rgb(37 99 235);
          font-weight: 500;
          font-size: 0.75rem;
        }

        .calendar-wrapper :global(.dark .fc .fc-more-link) {
          color: rgb(96 165 250);
        }
      `}</style>
    </div>
  );
};

export default CalendarioReservasSeccion;