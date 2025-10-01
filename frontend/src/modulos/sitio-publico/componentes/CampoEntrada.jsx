// Componente funcional reutilizable para un campo de entrada (input)
const CampoEntrada = ({ 
  id,                  // ID único para el input 
  nombre,              // Nombre del campo
  tipo = 'text',       // Tipo de input, por defecto es texto
  etiqueta,            // Texto que se muestra como etiqueta encima del campo
  marcadorPosicion,    // Placeholder que aparece dentro del campo
  icono: Icono,        // Icono que se muestra a la izquierda
  registro,            // Función de react-hook-form para registrar el campo
  error,               // Objeto de error de validación 
  className = ''       // Clases opcionales adicionales
}) => {
  return (
    // Contenedor principal del campo
    <div className={`relative ${className}`}>
      {/* etiqueta del campo */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {etiqueta}
      </label>

      {/* Contenedor del input e icono */}
      <div className="relative">
        {Icono && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icono className="text-gray-400" />
          </div>
        )}
        {/* Input del formulario */}
        <input
          type={tipo}
          id={id}
          {...registro(nombre)} // Registra el campo con react-hook-form
          // Si hay icono, deja espacio a la izquierda y cambia de borde si hay error
          className={`
            ${Icono ? 'pl-10' : 'pl-4'} 
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-primario focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder={marcadorPosicion} // placeholder dentro del input
        />
      </div>
      {/* muestra mensaje de error si existe */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default CampoEntrada;