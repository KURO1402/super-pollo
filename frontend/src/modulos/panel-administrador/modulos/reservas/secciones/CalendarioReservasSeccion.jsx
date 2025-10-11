// librerias externas
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// hook de react
import { useState, useRef, useEffect } from "react";
// componentes reutilizables
import Modal from "../../../componentes/modal/Modal";
// custom hook 
import { useModal } from "../../../hooks/useModal";

const CalendarioReservasSeccion = () => {
  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState(null);
  const [reservas, setReservas] = useState([]);

  // Campos del formulario que sera reemplazado más adelante por react-hook form
  const [nombreCliente, setNombreCliente] = useState("");
  const [numeroMesa, setNumeroMesa] = useState("");
  const [cantidadPersonas, setCantidadPersonas] = useState("");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");
  const [estadoReserva, setEstadoReserva] = useState("");

  const referenciaCalendario = useRef(null);
  const { estaAbierto, abrir, cerrar } = useModal(); // extraemos las funciones y estado del hoook del modal

  // Configuración de estados de reserva con colores mejorados para modo claro/oscuro
  const estadosReserva = {
    Pendiente: { // cada uno tiene un estilo diferente
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-l-4 border-yellow-400",
      text: "text-yellow-800 dark:text-yellow-200"
    },
    Pagado: {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-l-4 border-green-400",
      text: "text-green-800 dark:text-green-200"
    },
    Cancelado: {
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-l-4 border-red-400",
      text: "text-red-800 dark:text-red-200"
    }
  };

  const fechaMinima = new Date().toISOString().split("T")[0]; // calcular la fecha de hoy para que sea la fecha mínima

  // Datos de ejemplo para las reservas
  useEffect(() => {
    setReservas([
      {
        id: "1",
        title: "Juan Pérez (Mesa 3)",
        start: "2025-10-06",
        extendedProps: {
          estado: "Pendiente",
          hora: "19:00",
          cantidad: 4,
          mesa: 3,
          cliente: "Juan Pérez",
        },
      },
    ]);
  }, []);

  // Reiniciar campos cuando el modal se cierra
  useEffect(() => {
    if (!estaAbierto) reiniciarCamposModal();
  }, [estaAbierto]);

  // Función para limpiar todos los campos del formulario
  const reiniciarCamposModal = () => {
    setReservaSeleccionadaId(null);
    setNombreCliente("");
    setNumeroMesa("");
    setCantidadPersonas("");
    setFechaReserva("");
    setHoraReserva("");
    setEstadoReserva("");
  };

  // Abrir modal para agregar nueva reserva
  const abrirAgregarReserva = () => {
    reiniciarCamposModal();
    abrir();
  };

  // Manejar selección de fecha en el calendario
  const manejarSeleccionFecha = (info) => {
    const fechaSeleccionada = new Date(info.startStr);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // si la fecha es anterior a hoy entonces 
    if (fechaSeleccionada < hoy) {
      alert("No se pueden reservar fechas anteriores a hoy.");
      return;
    }

    reiniciarCamposModal();
    setFechaReserva(info.startStr);
    abrir();
  };

  // Manejar click en una reserva existente para editarla
  const manejarClickReserva = (info) => {
    const event = info.event;
    const props = event.extendedProps;
    setReservaSeleccionadaId(event.id);
    setNombreCliente(props?.cliente || "");
    setNumeroMesa(props?.mesa || "");
    setCantidadPersonas(props?.cantidad || "");
    setFechaReserva(event.start?.toISOString().split("T")[0] || "");
    setHoraReserva(props?.hora || "");
    setEstadoReserva(props?.estado || "");
    abrir();
  };

  // Validar y guardar la reserva
  const manejarGuardarReserva = () => {
    if (
      !nombreCliente ||
      !numeroMesa ||
      !cantidadPersonas ||
      !fechaReserva ||
      !horaReserva ||
      !estadoReserva
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const fechaSel = new Date(fechaReserva);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSel < hoy) {
      alert("No se puede reservar una fecha anterior a hoy.");
      return;
    }

    const nuevaReserva = {
      id: reservaSeleccionadaId || Date.now().toString(),
      title: `${nombreCliente} (Mesa ${numeroMesa})`,
      start: fechaReserva,
      allDay: true,
      extendedProps: {
        cliente: nombreCliente,
        mesa: numeroMesa,
        cantidad: cantidadPersonas,
        hora: horaReserva,
        estado: estadoReserva,
      },
    };

    setReservas((prev) => {
      if (reservaSeleccionadaId) {
        return prev.map((r) => (r.id === reservaSeleccionadaId ? nuevaReserva : r));
      }
      return [...prev, nuevaReserva];
    });

    cerrar();
    reiniciarCamposModal();
  };

  // Renderizado personalizado para los eventos en el calendario
  const contenidoReserva = (info) => {
    const estado = info.event.extendedProps?.estado || "Pendiente";
    const estadoConfig = estadosReserva[estado] || estadosReserva.Pendiente;
    
    return (
      <div
        className={`p-2 rounded-lg ${estadoConfig.bg} ${estadoConfig.border} ${estadoConfig.text} text-xs font-semibold shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        <div className="truncate font-medium">{info.event.title}</div>
        <div className="text-xs opacity-90 mt-1">
          {info.event.extendedProps?.hora || ""}
        </div>
      </div>
    );
  };

  // Configuración de todas las mesas disponibles
  const todasLasMesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Filtrar mesas disponibles según fecha y hora seleccionadas
  const mesasDisponibles = todasLasMesas.filter((mesa) => {
    return !reservas.some(
      (r) =>
        r.extendedProps.mesa === mesa &&
        r.start === fechaReserva &&
        r.extendedProps.hora === horaReserva &&
        r.id !== reservaSeleccionadaId
    );
  });

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar
          ref={referenciaCalendario}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next botonAgregarReserva",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={reservas}
          selectable={true}
          select={manejarSeleccionFecha}
          eventClick={manejarClickReserva}
          eventContent={contenidoReserva}
          customButtons={{
            botonAgregarReserva: {
              text: "Agregar Reserva +",
              click: abrirAgregarReserva,
            },
          }}
          locale="es"
          validRange={{ start: fechaMinima }}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          noEventsText="No hay reservas registradas"
          height="auto"
          dayMaxEvents={3}
          // Estilos personalizados para el calendario
          dayCellClassNames="group relative"
          dayHeaderClassNames="text-gray-700 dark:text-gray-300 dark:bg-gray-900 font-semibold"
          titleFormat={{ year: 'numeric', month: 'long' }}
          titleClass="text-xl font-bold text-gray-900 dark:text-white"
          buttonClass="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          buttonActiveClass="bg-brand-500 text-white border-brand-500 dark:bg-brand-600 dark:border-brand-600"
          moreLinkClass="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
          moreLinkContent={(args) => `+${args.num} más`}
          // Estilos para los números de día
          dayCellContent={(args) => {
            return (
              <div className="flex items-start justify-start p-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {args.dayNumberText}
                </span>
              </div>
            );
          }}
          // Estilos para los eventos
          eventClassNames="border-0 shadow-none"
          // Estilos para el header
          headerToolbarClass="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        />

        {/* Modal para agregar/editar reservas */}
        <Modal
          estaAbierto={estaAbierto}
          onCerrar={cerrar}
          titulo={reservaSeleccionadaId ? "Editar Reserva" : "Agregar Reserva"}
          tamaño="lg"
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                {reservaSeleccionadaId ? "Editar Reserva" : "Agregar Nueva Reserva"}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {reservaSeleccionadaId 
                  ? "Modifica los detalles de la reserva existente" 
                  : "Completa la información para crear una nueva reserva"}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cantidad de Personas
                </label>
                <input
                  type="number"
                  value={cantidadPersonas}
                  onChange={(e) => setCantidadPersonas(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: 3"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Fecha de la Reserva
                </label>
                <input
                  type="date"
                  min={fechaMinima}
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Hora de la Reserva
                </label>
                <input
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Número de Mesa
                </label>
                <select
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  disabled={!fechaReserva || !horaReserva}
                >
                  <option value="">
                    {fechaReserva && horaReserva
                      ? mesasDisponibles.length > 0
                        ? "Seleccione una mesa disponible"
                        : "No hay mesas disponibles en esta fecha/hora"
                      : "Seleccione primero la fecha y hora"}
                  </option>

                  {mesasDisponibles.map((mesa) => (
                    <option key={mesa} value={mesa}>
                      Mesa {mesa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Estado
                </label>
                <select
                  value={estadoReserva}
                  onChange={(e) => setEstadoReserva(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione un estado</option>
                  {Object.keys(estadosReserva).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8 sm:justify-end">
              <button
                onClick={() => {
                  cerrar();
                  reiniciarCamposModal();
                }}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={manejarGuardarReserva}
                className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-gray-800 dark:text-white transition-colors duration-200 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                {reservaSeleccionadaId ? "Actualizar Reserva" : "Guardar Reserva"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CalendarioReservasSeccion;