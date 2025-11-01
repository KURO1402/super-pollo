import { useFormContext } from "react-hook-form";
import { FiCalendar, FiLoader, FiUsers } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp  } from "react-icons/ti";
import { MdOutlineTableBar } from "react-icons/md";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";
import { useEffect } from "react";

const Paso1DatosBasicos = () => {
  const { register, formState: { errors }, watch, setValue, trigger } = useFormContext();
  const { mesasDisponibles, updateDatos, datos, buscarMesasDisponibles, cargandoMesas, errorMesas, limpiarMesas } = reservaEstadoGlobal();

  const fechaForm = watch('fecha');
  const horaForm = watch('hora');
  const personas = watch('personas') || datos.personas;
  const mesaForm = watch('mesa'); // Observar el valor del formulario para la mesa

  // Buscar mesas cuando cambia fecha u hora
  useEffect(() => {
    if (fechaForm && horaForm) {
      buscarMesasDisponibles(fechaForm, horaForm);
    } else {
      limpiarMesas();
    }
  }, [fechaForm, horaForm]);

  // Suncronizar forumlario con estado global
  useEffect(() => {
    if (datos.mesa && datos.mesa !== mesaForm) {
      setValue('mesa', datos.mesa, { shouldValidate: true });
    }
  }, [datos.mesa, mesaForm, setValue]);

  const handleSeleccionarMesa = (mesa) => {
    // Actualizar tanto el store como el formulario
    updateDatos({ mesa: mesa.numero });
    setValue('mesa', mesa.numero, { shouldValidate: true });
    trigger('mesa'); // Forzar validación
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Datos de la Reservación
        </h2>
        <p className="text-gray-400">
          Selecciona la fecha, hora y mesa para tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Fecha y Hora */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white">Fecha y Hora</h3>
            </div>
            
            <div className="space-y-4">
              <div className="scheme-dark">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  min={hoy}
                  {...register("fecha", { 
                    required: "La fecha es requerida",
                    validate: {
                      fechaFutura: (value) => {
                        if (value < hoy) {
                          return "La fecha debe ser hoy o en el futuro";
                        }
                        return true;
                      }
                    }
                  })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                {errors.fecha && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hora
                </label>
                <select
                  {...register("hora", { required: "La hora es requerida" })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Seleccionar hora</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
                {errors.hora && (
                  <p className="text-red-500 text-sm mt-1">{errors.hora.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Personas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="20"
                    {...register("personas", { 
                      required: "El número de personas es requerido",
                      min: { 
                        value: 2, 
                        message: "Mínimo 2 personas" 
                      },
                      max: { 
                        value: 20, 
                        message: "Máximo 20 personas" 
                      },
                      valueAsNumber: true
                    })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Ej: 4"
                  />
                  {/* Controles personalizados de incremento/decremento */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(watch("personas") || 2);
                        if (currentValue < 20) {
                          setValue("personas", currentValue + 1, { shouldValidate: true });
                        }
                      }}
                      className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-500 rounded text-white text-sm transition-colors"
                    >
                      <TiArrowSortedUp />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentValue = parseInt(watch("personas") || 2);
                        if (currentValue > 2) {
                          setValue("personas", currentValue - 1, { shouldValidate: true });
                        }
                      }}
                      className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-500 rounded text-white text-sm transition-colors"
                    >
                      <TiArrowSortedDown />
                    </button>
                  </div>
                </div>
                {errors.personas && (
                  <p className="text-red-500 text-sm mt-1">{errors.personas.message}</p>
                )}
              </div>

              <input
                type="hidden"
                {...register("mesa", { 
                  required: "Debes seleccionar una mesa"
                })}
              />
            </div>
          </div>
        </div>

        {/* Selección de Mesa - SIMPLIFICADO */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">
              <MdOutlineTableBar className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-white">Seleccionar Mesa</h3>
          </div>

          {cargandoMesas && (
            <div className="text-center py-8">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Buscando mesas disponibles...</p>
            </div>
          )}

          {errorMesas && !cargandoMesas && (
            <div className="text-center py-4 bg-red-500/10 rounded-lg">
              <p className="text-red-500">{errorMesas}</p>
            </div>
          )}

          {!cargandoMesas && !errorMesas && mesasDisponibles.length === 0 && fechaForm && horaForm && (
            <div className="text-center py-8">
              <p className="text-yellow-500 font-semibold">
                No hay mesas disponibles para esta fecha y hora
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otra fecha u horario
              </p>
            </div>
          )}

          {!cargandoMesas && !errorMesas && mesasDisponibles.length > 0 && (
            <>
              <div className="mb-4">
                <p className="text-gray-400 text-sm">
                  {mesasDisponibles.length} mesa{mesasDisponibles.length !== 1 ? 's' : ''} disponible{mesasDisponibles.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {mesasDisponibles.map(mesa => (
                  <div
                    key={mesa.id}
                    onClick={() => handleSeleccionarMesa(mesa)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                      datos.mesa === mesa.numero
                        ? "border-red-600 bg-red-600/10"
                        : "border-gray-600 hover:border-blue-600 hover:bg-gray-700/50"
                    }`}
                  >
                    <h4 className="font-semibold text-white text-lg mb-1">{mesa.numero}</h4>
                    <p className="text-sm text-gray-400">Capacidad: {mesa.capacidad} personas</p>
                    <span className={`text-sm font-medium mt-2 block ${
                      datos.mesa === mesa.numero ? "text-red-600" : "text-green-600"
                    }`}>
                      {datos.mesa === mesa.numero ? "Seleccionada" : "Disponible"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(!fechaForm || !horaForm) && !cargandoMesas && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                Selecciona fecha y hora para ver las mesas disponibles
              </p>
            </div>
          )}
          
          {errors.mesa && (
            <p className="text-red-500 text-sm mt-4 text-center bg-red-500/10 py-2 rounded-lg">
              {errors.mesa.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paso1DatosBasicos;