import { useEffect } from "react";
import { FiX } from "react-icons/fi";
// definimos los tamaños para el modal, ya que puede ser utilizado más de una vez
const tamaños = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
};
// todas las props que puede recibir el modal
const Modal = ({
  estaAbierto,
  onCerrar,
  titulo,
  children,
  tamaño,
  mostrarHeader,
  mostrarFooter,
  accionesFooter,
}) => {
  // Manejo de tecla ESC
  useEffect(() => {
    if (!estaAbierto) return; // si es falso no hace nada
    // si no ejecuta esta funcion
    const manejarTeclaESC = (e) => e.key === "Escape" && onCerrar(); // se activa cuando se preciona la tecla esc, verifica que sea la tecla correcta y si es asi ejecutamos la función de cerrar
    document.addEventListener("keydown", manejarTeclaESC);// se agrega un listener de evento al objeto document para que cuando se presione cualquier tecla, se ejecute la anterior funcion

    return () => {
      document.removeEventListener("keydown", manejarTeclaESC); // función de limpieza, para evitar que se acomulen los listeners
      
    };
  }, [estaAbierto, onCerrar]);// esto se ejecuta cada vez que hay un cambio en estas dos

  if (!estaAbierto) return null; // si es falso no retornamos nada

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay o fondo, si le da click al fondo llama a la función de cerrar*/}
      <div className="absolute inset-0 bg-black/40" onClick={onCerrar} />
      {/* Contenido */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${tamaños[tamaño]} max-h-[90vh] flex flex-col z-10`}
        onClick={(e) => e.stopPropagation()} // Impide que el clic en el contenido del modal cierre el modal
      >
        {/* Header o encabezado de nuestro modal, donde esta el boton de cerrar y el título */}
        {mostrarHeader && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {titulo}
            </h2>
            <button
              onClick={onCerrar}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <FiX size={24} />
            </button>
          </div>
        )}

        {/* el cuerpo de nuestro modal, se renderiza todo lo que se pasa dentro del modal*/}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {mostrarFooter && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            {accionesFooter ?? (
              <>
                <button
                  onClick={onCerrar}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onCerrar}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Confirmar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;