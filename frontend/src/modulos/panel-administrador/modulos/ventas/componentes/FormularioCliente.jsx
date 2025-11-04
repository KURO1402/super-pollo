// importamos librerías externas
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
// hooks de react
import { useEffect, useState } from "react";
// servicios
import { obtenerTiposDocumento } from "../../../../sitio-publico/servicios/tiposDocService";
import { buscarPorDNI, buscarPorRUC } from "../servicios/consultarClienteService";
// custom hooks
import useConfiguracionDocumento from "../hooks/useConfiguracionDocumento";

// formulario para el cliente, que resibe como parametro la función de submit y oncancelar
export const FormularioCliente = ({ onSubmit, onCancelar }) => {
  // estados para el tipo de Documento, la carga y el error al momento de traer los tipo de la base de datos
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  // nuevos estados para la búsqueda
  const [buscando, setBuscando] = useState(false);
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");
  
  // funciones de react hook form
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm();

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

  // Usamos el custom hook para mostrar el placeholder dependiendo del tipo de documento, además de 
  const { placeholder, busquedaHabilitada } = useConfiguracionDocumento(tipo, setValue); // Obtenemos el placeholder y busquedaHabilitada del hook

  // función para ejecutar la busqueda con el microservicio
  const handleBuscar = async () => {
    if (!busquedaHabilitada) return;
    
    setBuscando(true);
    setMensajeBusqueda("");
    
    try {
      let data; // nuestra variable 
      let nombreCompleto = ""; // Inicializamos la variable fuera de los condicionales
      let datosFormateados = ""

      if (tipo === "1") { // si el tipo es igual a 1 (DNI), se llamará a la función de buscarPorDNI
        data = await buscarPorDNI(numeroDoc);
        
        // Validar si la búsqueda fue exitosa
        if (data.success === true) {
          nombreCompleto = data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres; // concatenamos para obtener el nombre completo
          datosFormateados = nombreCompleto.replace(/\b\w/g, char => char.toUpperCase()).replace(/\B\w/g, char => char.toLowerCase());
          setValue("nombre", datosFormateados);
          setMensajeBusqueda("Datos encontrados correctamente");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", ""); // Limpiar el campo nombre
        }
        
      } else if (tipo === "3") { // si el tipo es igual a 3 (RUC), se llamará a la función de buscarPorRUC
        data = await buscarPorRUC(numeroDoc);
        
        // Validar si la búsqueda fue exitosa - para RUC verificamos que exista el ruc
        if (data && data.ruc) {
          // Rellenar razón social en el campo nombre
          setValue("nombre", data.razonSocial);
          
          // Rellenar la dirección si está disponible
          if (data.direccion) {
            setValue("direccion", data.direccion);
          }
          
          // También podemos rellenar el nombre comercial si está disponible y no es null
          if (data.nombreComercial) {
            setValue("nombreComercial", data.nombreComercial);
          }
          
          setMensajeBusqueda("Datos encontrados correctamente");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", ""); // Limpiar el campo nombre
          setValue("direccion", ""); // Limpiar la dirección
          setValue("nombreComercial", ""); // Limpiar nombre comercial
        }
        
      } else { // si no cumple ninguno de los casos (Carnet de extranjería)
        console.log("Búsqueda solo disponible para DNI y RUC");
        setMensajeBusqueda("Búsqueda solo disponible para DNI y RUC");
        return;
      }
    } catch (err) {
      console.error(err.message);
      setMensajeBusqueda("Error en la búsqueda: " + err.message);
      setValue("nombre", ""); // Limpiar el campo nombre en caso de error
      setValue("direccion", ""); // Limpiar también la dirección
      setValue("nombreComercial", ""); // Limpiar nombre comercial
    } finally {
      setBuscando(false);
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
                  if (tipo === "3" && value.length !== 11) {
                    return "El RUC debe tener 11 dígitos";
                  }
                  if (tipo === "2" && !/^[A-Z0-9]{6,12}$/i.test(value)) {
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
              disabled={!busquedaHabilitada || buscando}
              className={`px-3 flex items-center justify-center rounded-r-lg transition-colors duration-200 ${
                busquedaHabilitada && !buscando
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {buscando ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiSearch size={18} />
              )}
            </button>
          </div>
          {errors.numeroDocumento && (
            <span className="text-xs text-red-500">{errors.numeroDocumento.message}</span>
          )}
          
          {/* Mensaje de estado de búsqueda */}
          {buscando && (
            <p className="text-xs text-blue-500 mt-1">Buscando información...</p>
          )}
          {mensajeBusqueda && !buscando && (
            <p className={`text-xs mt-1 ${
              mensajeBusqueda.includes("encontrados") 
                ? "text-green-500" 
                : mensajeBusqueda.includes("No se encontraron")
                ? "text-yellow-500"
                : "text-red-500"
            }`}>
              {mensajeBusqueda}
            </p>
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
          Dirección *
        </label>
        <input
          type="text"
          {...register("direccion", { 
            required: tipo === "3" ? "Este campo es obligatorio para RUC" : false 
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={tipo === "3" ? "Dirección fiscal (obligatoria)" : "Dirección completa"}
        />
        {errors.direccion && (
          <span className="text-xs text-red-500">{errors.direccion.message}</span>
        )}
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

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
          Requisitos para Factura:
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
          <li>RUC obligatorio (11 dígitos)</li>
          <li>Dirección fiscal requerida</li>
          <li>Razón social de la empresa</li>
        </ul>
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