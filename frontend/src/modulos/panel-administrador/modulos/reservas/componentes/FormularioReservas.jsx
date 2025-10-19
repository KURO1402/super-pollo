import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { FiCalendar, FiClock, FiUsers, FiBox, FiSave, FiX, FiMessageSquare, FiPhone } from "react-icons/fi";
import { configuracionMesas, horariosDisponibles, estadosReserva } from "../data-temporal/mockReservas";
import { validarDisponibilidadMesa } from "../utilidades/ValidacionesReservaciones"

const FormularioReserva = ({ reservaInicial, reservas, onSubmit, onCancelar, guardando }) => {

  const fechaMinima = new Date().toISOString().split("T")[0];
  const {
    control, handleSubmit, watch, reset, formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreCliente: "",
      telefono: "",
      cantidadPersonas: 2,
      fechaReserva: "",
      horaReserva: "",
      numeroMesa: "",
      estado: "pendiente",
      comentarios: "",
    },
  });

  const fechaReservaWatch = watch("fechaReserva");
  const horaReservaWatch = watch("horaReserva");

  useEffect(() => {
    if (reservaInicial) {
      reset(reservaInicial);
    } else {
      reset({
        nombreCliente: "",
        telefono: "",
        cantidadPersonas: 2,
        fechaReserva: "",
        horaReserva: "",
        numeroMesa: "",
        estado: "pendiente",
        comentarios: "",
      });
    }
  }, [reservaInicial, reset]);

  const validaciones = {
    nombreCliente: {
      required: "El nombre del cliente es requerido",
      minLength: { value: 3, message: "Mínimo 3 caracteres" },
      maxLength: { value: 100, message: "Máximo 100 caracteres" },
      pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: "Solo letras y espacios"
      },
    },
    telefono: {
      pattern: {
        value: /^[9]\d{8}$/,
        message: "Formato: 9 dígitos comenzando con 9"
      },
    },
    cantidadPersonas: {
      required: "Campo requerido",
      min: { value: 1, message: "Mínimo 1 persona" },
      max: { value: 20, message: "Máximo 20 personas" },
    },
    fechaReserva: {
      required: "La fecha es requerida",
      validate: {
        noEsPasada: (value) => {
          const fechaSel = new Date(value);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          return fechaSel >= hoy || "No se pueden reservar fechas pasadas";
        },
      },
    },
    horaReserva: {
      required: "La hora es requerida",
    },
    numeroMesa: {
      required: "Debe seleccionar una mesa",
    },
    estado: {
      required: "Debe seleccionar un estado",
    },
    comentarios: {
      maxLength: { value: 500, message: "Máximo 500 caracteres" },
    },
  };

  const mesasDisponibles = configuracionMesas.mesas.filter((mesa) => {
    if (!fechaReservaWatch || !horaReservaWatch) return true;
    
    return validarDisponibilidadMesa(
      reservas,
      fechaReservaWatch,
      horaReservaWatch,
      mesa.numero,
      reservaInicial?.id
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Información del cliente */}
      {reservaInicial && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <FiUsers size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
            <p className="text-gray-900 dark:text-white font-medium">{reservaInicial.nombreCliente}</p>
            {reservaInicial.id && (
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{reservaInicial.id}</p>
            )}
          </div>
        </div>
      )}

      {/* Nombre del Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <FiUsers size={16} className="text-purple-600 dark:text-purple-400" />
            Nombre del Cliente <span className="text-red-500">*</span>
          </div>
        </label>
        <Controller
          name="nombreCliente"
          control={control}
          rules={validaciones.nombreCliente}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Juan Pérez García"
              />
              {errors.nombreCliente && (
                <p className="text-xs text-red-500 mt-1">⚠️ {errors.nombreCliente.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <FiPhone size={16} className="text-green-600 dark:text-green-400" />
            Teléfono
          </div>
        </label>
        <Controller
          name="telefono"
          control={control}
          rules={validaciones.telefono}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="987654321"
                maxLength="9"
              />
              {errors.telefono && (
                <p className="text-xs text-red-500 mt-1">⚠️ {errors.telefono.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiCalendar size={16} className="text-blue-600 dark:text-blue-400" />
              Fecha de Reserva <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="fechaReserva"
            control={control}
            rules={validaciones.fechaReserva}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="date"
                  min={fechaMinima}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]"
                />
                {errors.fechaReserva && (
                  <p className="text-xs text-red-500 mt-1">⚠️ {errors.fechaReserva.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiClock size={16} className="text-blue-600 dark:text-blue-400" />
              Hora de Reserva <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="horaReserva"
            control={control}
            rules={validaciones.horaReserva}
            render={({ field }) => (
              <>
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione</option>
                  <optgroup label="Almuerzo">
                    {horariosDisponibles.filter((h) => h >= "12:00" && h <= "15:00").map((hora) => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Cena">
                    {horariosDisponibles.filter((h) => h >= "18:00" && h <= "22:00").map((hora) => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </optgroup>
                </select>
                {errors.horaReserva && (
                  <p className="text-xs text-red-500 mt-1">⚠️ {errors.horaReserva.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Cantidad de Personas y Mesa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiUsers size={16} className="text-green-600 dark:text-green-400" />
              Cantidad de Personas <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="cantidadPersonas"
            control={control}
            rules={validaciones.cantidadPersonas}
            render={({ field: { onChange, value, ...field } }) => (
              <>
                <input
                  {...field}
                  type="number"
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="20"
                />
                {errors.cantidadPersonas && (
                  <p className="text-xs text-red-500 mt-1">⚠️ {errors.cantidadPersonas.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiBox size={16} className="text-amber-600 dark:text-amber-400" />
              Número de Mesa <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="numeroMesa"
            control={control}
            rules={validaciones.numeroMesa}
            render={({ field: { onChange, value, ...field } }) => (
              <>
                <select
                  {...field}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  disabled={!fechaReservaWatch || !horaReservaWatch}
                >
                  <option value="">
                    {!fechaReservaWatch || !horaReservaWatch
                      ? "Seleccione fecha y hora primero"
                      : mesasDisponibles.length > 0
                      ? "Seleccione una mesa"
                      : "No hay mesas disponibles"}
                  </option>
                  {mesasDisponibles.map((mesa) => (
                    <option key={mesa.numero} value={mesa.numero}>
                      Mesa {mesa.numero} - {mesa.zona} ({mesa.capacidad}p)
                    </option>
                  ))}
                </select>
                {errors.numeroMesa && (
                  <p className="text-xs text-red-500 mt-1">⚠️ {errors.numeroMesa.message}</p>
                )}
                {fechaReservaWatch && horaReservaWatch && mesasDisponibles.length === 0 && (
                  <p className="text-xs text-orange-500 mt-1">ℹ️ No hay mesas disponibles en este horario</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estado de la Reserva <span className="text-red-500">*</span>
        </label>
        <Controller
          name="estado"
          control={control}
          rules={validaciones.estado}
          render={({ field }) => (
            <>
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {Object.values(estadosReserva).map((estado) => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="text-xs text-red-500 mt-1">⚠️ {errors.estado.message}</p>
              )}
            </>
          )}
        />
      </div>

      {/* Comentarios */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <FiMessageSquare size={16} className="text-gray-600 dark:text-gray-400" />
            Comentarios adicionales
          </div>
        </label>
        <Controller
          name="comentarios"
          control={control}
          rules={validaciones.comentarios}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Preferencias especiales del cliente..."
                maxLength="500"
              />
              {errors.comentarios && (
                <p className="text-xs text-red-500 mt-1">⚠️ {errors.comentarios.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {field.value?.length || 0}/500 caracteres
              </p>
            </>
          )}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={16} />
          {guardando ? "Guardando..." : reservaInicial?.id ? "Actualizar Reserva" : "Guardar Reserva"}
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;