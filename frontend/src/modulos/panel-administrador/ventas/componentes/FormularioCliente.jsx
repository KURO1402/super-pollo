import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerTiposDocumento } from "../../../sitio-publico/servicios/tiposDocService";
import { FiSearch } from "react-icons/fi";
import { buscarPorDNI, buscarPorRUC } from "../servicios/consultarClienteService";
// formulario para el cliente, que resibe como parametro la función de submit y oncancelar
export const FormularioCliente = ({ onSubmit, onCancelar }) => {
  // funciones de react hook form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  // estados para el tipo de Documento, la carga y el error al momento de traer los tipo de la base de datos
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // función para rellenar el select de tipo de documento, con la base de datos
  useEffect(() => {
    const cargarTipos = async () => { // la función es asincrónica
      try {
        const data = await obtenerTiposDocumento(); // obtenemos los tipos de comprobante
        setTiposDocumento(data); // actualizamos nuestro estado
      } catch (error) { 
        setErrorCarga(error.message); // actualizamos nuestro estado de error con el error que se a producido
      } finally {
        setCargando(false); // actualizamos el estado para la carga a falso para que desaparesca
      }
    };
    cargarTipos(); // llamamos a la función
  }, []);
  
  const tipo = watch("tipoDocumento"); // Observa el valor del select
  const numeroDoc = watch("numeroDocumento") // ver el valor del numero de documento
  const [placeholder, setPlaceholder] = useState("Ingrese el número de documento"); // el estado para el placeholder del numero de documento del cliente
  const [searchEnabled, setSearchEnabled] = useState(false); // para el manajo del boton

  // Efecto para cambiar validación y placeholder según el tipoDocumento
  useEffect(() => {
    if (tipo === "1") {
      // DNI
      setPlaceholder("Ejemplo: 87654321"); // el placeholder para el input
      setSearchEnabled(true); // para usar el boton de busqueda
      setValue("numeroDocumento", ""); // reset input
    } else if (tipo === "2") {
      // Pasaporte
      setPlaceholder("Ejemplo: E1234567");
      setSearchEnabled(false);
      setValue("numeroDocumento", "");
    } else if (tipo === "3") {
      // Carne de extranjería
      setPlaceholder("Ejemplo: P1234567");
      setSearchEnabled(false);
      setValue("numeroDocumento", "");
    } else if (tipo === "4") {
      // RUC
      setPlaceholder("Ejemplo: 20123456789");
      setSearchEnabled(true);
      setValue("numeroDocumento", "");
    }
  }, [tipo, setValue]); // se ejecuta cuando se cambia el tipo o el setValue

  // función para ejecutar la busqueda con el microservicio
  const handleBuscar = async () => {
    try {
      let data; // nuestra variable 
      let datosFormateados = ""; // Inicializamos la variable fuera de los condicionales

      if (tipo === "1") { // si el tipo es igual a 1, se llamará a la función de buscarPorDNI
        data = await buscarPorDNI(numeroDoc);
        datosFormateados = data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres; // concatenamos para obtener el nombre completo
      } else if (tipo === "4") { // lo mismo para el RUC
        data = await buscarPorRUC(numeroDoc);
        datosFormateados = data.razonSocial;
      } else { // si no cumple ninguno de los casos
        console.log("Búsqueda solo disponible para DNI y RUC");
        return;
      }
      // Asignamos el valor al campo de formulario
      setValue("nombre", datosFormateados);
    } catch (err) {
      console.error(err.message);
    }
  };

  // enviamos los datos registrados o insertados
  const manejarEnviar = (data) => {
    onSubmit(data); // mandamos todos los datos del cliente
  };

  return (
    <form onSubmit={handleSubmit(manejarEnviar)} className="space-y-4">
      {/* Primera fila tipo Documento y numero */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Documento *
          </label>
          {cargando ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : errorCarga ? (
            <p className="text-sm text-red-500">{errorCarga}</p>
          ) : (
            <select
              {...register("tipoDocumento", { required: "Este campo es obligatorio" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Selecciona un tipo</option>
              {tiposDocumento.map((doc) => (
                <option key={doc.idTipoDocumento} value={doc.idTipoDocumento}>
                  {doc.nombreTipoDocumento}
                </option>
              ))}
            </select>
          )}

          {errors.tipoDocumento && (
            <span className="text-xs text-red-500">{errors.tipoDocumento.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Número de Documento *
          </label>
          <div className="relative flex rounded-lg shadow-sm">
          <input
            type="text"
            placeholder={placeholder}
            {...register("numeroDocumento", {
              required: "Este campo es obligatorio",
              validate: (value) => {
                // hacemos la validación para cada input
                if (tipo === "1" && value.length !== 8) {
                  return "El DNI debe tener 8 dígitos";
                }
                if (tipo === "4" && value.length !== 11) {
                  return "El RUC debe tener 11 dígitos";
                }
                if (tipo === "2" && !/^[A-Z0-9]{6,12}$/i.test(value)) {
                  return "Pasaporte inválido";
                }
                if (tipo === "3" && !/^[A-Z0-9]{9,12}$/i.test(value)) {
                  return "Carné de extranjería inválido";
                }
                return true; // si no hay ningun error regresamos true
              },
            })}
            className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-l-lg dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleBuscar}
            type="button"
            disabled={!searchEnabled}
            className={`px-3 flex items-center justify-center rounded-r-lg transition-colors duration-200 ${
              searchEnabled
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiSearch size={18} />
          </button>
        </div>
          {errors.numeroDocumento && (
            <span className="text-xs text-red-500">{errors.numeroDocumento.message}</span>
          )}
        </div>
      </div>

      {/* Segunda fila: Nombre y Nombre Comercial */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre / Razón Social *
          </label>
          <input
            type="text"
            {...register("nombre", { required: "Este campo es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre completo o razón social"
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre Comercial
          </label>
          <input
            type="text"
            {...register("nombreComercial")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre comercial (opcional)"
          />
        </div>
      </div>

      {/* Tercera fila: Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección
        </label>
        <input
          type="text"
          {...register("direccion")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dirección completa"
        />
      </div>

      {/* Cuarta fila: Teléfono y Correo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            {...register("telefono", {
              pattern: {
                value: /^[0-9+-\s]+$/,
                message: "Formato de teléfono inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Número de teléfono"
          />
          {errors.telefono && (
            <span className="text-xs text-red-500">{errors.telefono.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  );
};