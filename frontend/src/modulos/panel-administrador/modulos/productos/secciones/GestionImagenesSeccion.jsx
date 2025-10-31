// componentes/GestionImagenesSeccion.jsx
import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useProductos } from '../hooks/useProductos';
import { TarjetaProducto } from '../componentes/TarjetaProducto';
import { ModalModificarImagen } from '../componentes/ModalModificarImagen'
import Modal from '../../../componentes/modal/Modal';
import { useModal } from '../../../hooks/useModal';

const GestionImagenesSeccion = () => {
  const { productos, cargando, refetch } = useProductos();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const modalModificarImagen = useModal(false);

  const handleModificarImagen = (producto) => {
    setProductoSeleccionado(producto);
    modalModificarImagen.abrir();
  };

  const handleGuardarImagen = () => {
    refetch(); // Recargar productos para mostrar la nueva imagen
    modalModificarImagen.cerrar();
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiImage className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Imágenes de Productos
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Modifica las imágenes de tus productos. Pasa el cursor sobre una imagen para ver las opciones.
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.idProducto}
            producto={producto}
            onModificarImagen={handleModificarImagen}
          />
        ))}
      </div>

      {/* Modal para modificar imagen */}
      <Modal
        estaAbierto={modalModificarImagen.estaAbierto}
        onCerrar={modalModificarImagen.cerrar}
        titulo={`Modificar Imagen: ${productoSeleccionado?.nombreProducto || ''}`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {productoSeleccionado && (
          <ModalModificarImagen
            producto={productoSeleccionado}
            onClose={modalModificarImagen.cerrar}
            onGuardar={handleGuardarImagen}
          />
        )}
      </Modal>
    </div>
  );
};

export default GestionImagenesSeccion;