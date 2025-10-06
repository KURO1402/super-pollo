// componente de un botón simple que se puede reutilizar, se envia el icono, la función que ejecutará el botón y el nombre que se le quiere dar
export const BotonSimple = ({icono: Icono, funcion, etiqueta}) => {
    return ( 
        <button
            onClick={funcion}
            className="px-6 py-3 text-sm font-medium text-gray-800 rounded-3xl border-1 border-gray-300 dark:text-gray-300 hover:text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm cursor-pointer flex items-center space-x-2"
        >
            <Icono className="text-gray-800 dark:text-gray-300" />
            <span>{etiqueta}</span>
        </button>
     );
}