const CampoSelect = ({ 
  id, // id del campo
  nombre,  // nombre
  etiqueta,  // para el label 
  opciones = [], // array de acciones para el select
  icono: Icono, // Icono que se mostrará en el select
  registro, // funcion de registro de react hook form
  error, // objeto de errores, para mostrar las validaciones
  placeholder = "Selecciona una opción", // texto por defecto para la oppcion vacia
  className = '' // clase adicional para el contenedor
}) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {etiqueta} 
      </label>
      {/* si se proporciona un icono, se muestra en la parte izquierda dentro del select */}
      <div className="relative">
        {Icono && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icono className="text-gray-400" />
          </div>
        )}
        {/* elemento select con estilos condicionales segun si hay icono o error */}
        <select
          id={id} // Asocia el select con el label por su ID
          {...registro(nombre)} //se registra el campo en el formulario
          // clases dinánimas para el icono y los mensajes de la validacion
          className={`
            ${Icono ? 'pl-10' : 'pl-4'}
            w-full text-gray-500 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-primario focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
            bg-white appearance-none pr-10
          `}
        >
          {/* primera opción vacía como placeholder que esta deshabilitada para evitar selección */}
          <option value="" className="text-gray-500" disabled>
            {placeholder}
          </option>
          {/* mapeo de las opciones que recibe el componente para mostrarlas como opciones del select */}
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor} className="absolute text-gray-500">
              {opcion.valor}
            </option>
          ))}
        </select>
        {/* Flecha personalizada del select*/}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {/* Si existe un error se muestra el mensaje debajo del select */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
// exportamos 
export default CampoSelect;