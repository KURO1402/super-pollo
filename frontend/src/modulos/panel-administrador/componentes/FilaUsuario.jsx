import { FiEdit, FiTrash2, FiMail, FiPhone } from "react-icons/fi";

const FilaUsuario = ({ usuario }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditar = () => {
    // Lógica para editar usuario
    console.log("Editar usuario:", usuario);
  };

  const handleEliminar = () => {
    // Lógica para eliminar usuario
    if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      console.log("Eliminar usuario:", usuario);
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {usuario.nombre} {usuario.apellido}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Registrado: {formatDate(usuario.fechaRegistro)}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FiMail className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">{usuario.correo}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{usuario.telefono}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          usuario.rol === "Superadministrador" 
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" 
            : usuario.rol === "Administrador"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            : usuario.rol === "Cajero"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
        }`}>
          {usuario.rol}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          usuario.estado === "activo" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {usuario.estado === "activo" ? "Activo" : "Inactivo"}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {usuario.ultimoAcceso ? formatDate(usuario.ultimoAcceso) : "Nunca"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditar}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            title="Editar usuario"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={handleEliminar}
            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
            title="Eliminar usuario"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FilaUsuario;