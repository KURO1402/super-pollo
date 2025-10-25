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
  FiFilter
} from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock, FaRegTimesCircle } from "react-icons/fa";

const MisReservaciones = () => {
  const [filtro, setFiltro] = useState("todas");
  
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
    {
      id: 2,
      fecha: "2024-01-20",
      hora: "20:30",
      personas: 2,
      estado: "pendiente",
      mesa: "Mesa 5",
      notas: "Cena romántica",
      codigo: "RES-002"
    },
    {
      id: 3,
      fecha: "2024-01-10",
      hora: "13:00",
      personas: 6,
      estado: "cancelada",
      mesa: "Mesa 8",
      notas: "Almuerzo familiar",
      codigo: "RES-003"
    },
    {
      id: 4,
      fecha: "2024-01-25",
      hora: "14:30",
      personas: 3,
      estado: "confirmada",
      mesa: "Mesa 3",
      notas: "Reunión de trabajo",
      codigo: "RES-004"
    }
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
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelada":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const reservacionesFiltradas = filtro === "todas" 
    ? reservaciones 
    : reservaciones.filter(res => res.estado === filtro);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-azul-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            MIS <span className="text-rojo">RESERVACIONES</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Gestiona y revisa todas tus reservas en Super Pollo
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaRegCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Confirmadas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaRegClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pendientes</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaRegTimesCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Canceladas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-azul-primario/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCalendar className="w-6 h-6 text-azul-primario" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
          </div>
        </div>

        {/* Barra de Herramientas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Barra de Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar reservación..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-primario focus:border-transparent transition-all"
                />
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltro("todas")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "todas" 
                      ? "bg-azul-primario text-white shadow-lg" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltro("confirmada")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "confirmada" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Confirmadas
                </button>
                <button
                  onClick={() => setFiltro("pendiente")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filtro === "pendiente" 
                      ? "bg-yellow-500 text-white shadow-lg" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {reserva.codigo}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                          <FiCalendar className="w-5 h-5 text-azul-primario" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(reserva.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rojo/10 rounded-lg flex items-center justify-center">
                          <FiClock className="w-5 h-5 text-rojo" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{reserva.hora}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Personas</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{reserva.personas}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mesa</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{reserva.mesa}</p>
                        </div>
                      </div>
                    </div>

                    {reserva.notas && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay reservaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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