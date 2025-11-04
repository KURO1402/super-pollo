import { useState } from "react";
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiMapPin, 
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock, FaRegTimesCircle } from "react-icons/fa";
import { obtenerReservacionesPorUsuario } from "../../servicios/reservacionesServicio";

const MisReservaciones = () => {
  const [filtro, setFiltro] = useState("todas");
  const [ reserva, setReserva ] = useState(null);

  useEffect(() => {
    const reserva = obtenerReservacionesPorUsuario();
    console.log(reserva)
  }, []);
  
  // Datos de ejemplo para reservaciones
  const reservaciones = [
    {
      id: 1,
      fecha: "2024-01-15",
      hora: "19:00",
      personas: 4,
      estado: "confirmada",
      mesa: "Mesa 12",
      notas: "Celebración de cumpleaños",
      codigo: "RES-001"
    },
  ];

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "confirmada":
        return <FaRegCheckCircle className="w-5 h-5 text-green-500" />;
      case "pendiente":
        return <FaRegClock className="w-5 h-5 text-yellow-500" />;
      case "cancelada":
        return <FaRegTimesCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FaRegClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-900/30 text-green-400";
      case "pendiente":
        return "bg-yellow-900/30 text-yellow-400";
      case "cancelada":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-gray-900/30 text-gray-400";
    }
  };

  const reservacionesFiltradas = filtro === "todas" 
    ? reservaciones 
    : reservaciones.filter(res => res.estado === filtro);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            MIS <span className="text-rojo">RESERVACIONES</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestiona y revisa todas tus reservas en Super Pollo
          </p>
        </div>

        {/* Barra de Herramientas */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">

              {/* Filtros */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltro("todas")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "todas" 
                      ? "bg-azul-primario text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltro("confirmada")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "confirmada" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Confirmadas
                </button>
                <button
                  onClick={() => setFiltro("pendiente")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "pendiente" 
                      ? "bg-yellow-500 text-white shadow-lg" 
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Pendientes
                </button>
              </div>
            </div>

            {/* Botón Nueva Reservación */}
            <button className="flex items-center gap-2 bg-rojo hover:bg-rojo/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap">
              <FiPlus className="w-5 h-5" />
              Nueva Reservación
            </button>
          </div>
        </div>

        {/* Lista de Reservaciones */}
        <div className="space-y-6">
          {reservacionesFiltradas.map((reserva) => (
            <div 
              key={reserva.id}
              className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  
                  {/* Información Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {getEstadoIcono(reserva.estado)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                          {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 font-mono">
                        {reserva.codigo}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                          <FiCalendar className="w-5 h-5 text-azul-primario" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Fecha</p>
                          <p className="font-semibold text-white">
                            {new Date(reserva.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rojo/10 rounded-lg flex items-center justify-center">
                          <FiClock className="w-5 h-5 text-rojo" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Hora</p>
                          <p className="font-semibold text-white">{reserva.hora}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Personas</p>
                          <p className="font-semibold text-white">{reserva.personas}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Mesa</p>
                          <p className="font-semibold text-white">{reserva.mesa}</p>
                        </div>
                      </div>
                    </div>

                    {reserva.notas && (
                      <div className="mt-4 p-3 bg-gray-700 rounded-xl">
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold">Notas:</span> {reserva.notas}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-azul-primario hover:bg-azul-primario/90 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105">
                      <FiEdit3 className="w-4 h-4" />
                      Editar
                    </button>
                    <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105">
                      <FiTrash2 className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay reservaciones */}
        {reservacionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay reservaciones
            </h3>
            <p className="text-gray-400 mb-6">
              {filtro === "todas" 
                ? "Aún no has realizado ninguna reservación" 
                : `No hay reservaciones ${filtro}s`}
            </p>
            <button className="bg-rojo hover:bg-rojo/90 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105">
              Realizar mi primera reservación
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisReservaciones;