// componente funcional para renderizar un campo tipo checkbox
const CampoCheckbox = ({ id, nombre, etiqueta, registro, error, className = '' }) => { // se envian los props
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox" // tipo de campo
          id={id} // id único
          {...registro(nombre)} // Registra el campo usando react-hook-form
          className={`
            h-4 w-4 text-azul-primario focus:ring-azul-primario border-gray-300 rounded
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      {/* contenedor para la etiqueta y el mensaje de error */}
      <div className="ml-2">
        <label htmlFor={id} className="text-sm text-gray-900">
          {etiqueta}  {/* muestra la etiqueta proporcionada */}
        </label>
        {/* si hay error se muestra el mensaje debajo */}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error.message} {/* mensaje de error */}
          </p>
        )}
      </div>
    </div>
  );
};

export default CampoCheckbox;