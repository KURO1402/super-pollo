import { useFormContext } from "react-hook-form";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { MdOutlineTableBar } from "react-icons/md";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";
import { useEffect } from "react";

const Paso1DatosBasicos = () => {
  const { register, formState: { errors }, watch, setValue, trigger } = useFormContext();
  const { mesasDisponibles, updateDatos, datos } = reservaEstadoGlobal();
  
  const personas = watch('personas') || datos.personas;
  const mesaForm = watch('mesa'); // Observar el valor del formulario para la mesa

  // Sincronizar el estado del formulario con el estado global
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

  // Filtrar mesas disponibles basado en el número de personas
  const mesasFiltradas = mesasDisponibles.filter(mesa => 
    mesa.capacidad >= personas
  );

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
              <div>
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                <select
                  {...register("personas", { 
                    required: "El número de personas es requerido",
                    min: { value: 1, message: "Mínimo 1 persona" }
                  })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                </select>
                {errors.personas && (
                  <p className="text-red-500 text-sm mt-1">{errors.personas.message}</p>
                )}
              </div>

              {/* Campo oculto para la mesa en el formulario */}
              <input
                type="hidden"
                {...register("mesa", { 
                  required: "Debes seleccionar una mesa",
                  validate: {
                    mesaValida: (value) => {
                      const mesaExiste = mesasDisponibles.some(mesa => mesa.numero === value);
                      if (!mesaExiste) {
                        return "Mesa no válida";
                      }
                      return true;
                    }
                  }
                })}
              />
            </div>
          </div>
        </div>

        {/* Selección de Mesa */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">
              <MdOutlineTableBar className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-white">Seleccionar Mesa</h3>
          </div>

          {mesasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-yellow-500 font-semibold">
                No hay mesas disponibles para {personas} {personas === 1 ? 'persona' : 'personas'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Reduce el número de personas o contacta con el restaurante
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-400 text-sm">
                  Mesas disponibles para {personas} {personas === 1 ? 'persona' : 'personas'}
                </p>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mesasFiltradas.map(mesa => (
                  <div
                    key={mesa.id}
                    onClick={() => handleSeleccionarMesa(mesa)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      datos.mesa === mesa.numero
                        ? "border-red-600 bg-red-600/10"
                        : "border-gray-600 hover:border-blue-600 hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{mesa.numero}</h4>
                        <p className="text-sm text-gray-400">{mesa.ubicacion}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <FiUsers className="w-4 h-4" />
                          <span>Hasta {mesa.capacidad} personas</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          datos.mesa === mesa.numero ? "text-red-600" : "text-green-600"
                        }`}>
                          {datos.mesa === mesa.numero ? "Seleccionada" : "Disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
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