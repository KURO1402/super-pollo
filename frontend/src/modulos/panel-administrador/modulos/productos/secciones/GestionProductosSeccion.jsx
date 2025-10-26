// librerías
import { BsBoxSeam } from "react-icons/bs";
// hook de react
import { useState } from 'react';
// componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from '../../../componentes/modal/Modal';
import { ModalConfirmacion } from "../../../componentes/modal/ModalConfirmacion";
// custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useConfirmacion } from "../../../hooks/useConfirmacion";
import { useProductos } from "../hooks/useProductos";
// componentes de la seccion
import { ModalReceta } from '../componentes/ModalReceta';
import { ModalNuevoProducto } from '../componentes/ModalNuevoProducto'
import { FilaProducto } from '../componentes/FilaProductos';
// servicio
import { eliminarProductoServicio } from "../servicios/productoServicios";
import mostrarAlerta from "../../../../../utilidades/toastUtilidades";
import { ModalEditarProducto } from "../componentes/ModalEditarProducto";

const GestionProductosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { productos, cargando, error, refetch } = useProductos();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // modales
  const modalReceta = useModal(false);
  const modalNuevoProducto = useModal(false);
  const modalEditarProducto = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  // funcion que escucha el evente de gestionar insumos
  function handleGestionarInsumos(producto) {
    setProductoSeleccionado(producto);
    modalReceta.abrir();
  }

  // funcion para abrir modal nuevo producto
  function handleNuevoProducto() {
    modalNuevoProducto.abrir();
  }

  // función para abrir modal editar producto
  function handleEditarProducto(producto) {
    setProductoSeleccionado(producto);
    modalEditarProducto.abrir();
  }

  // función para solicitar confirmación de eliminación
  function handleSolicitarEliminar(producto) {
    setProductoAEliminar(producto);
    
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar el producto "${producto.nombreProducto}"? Esta acción no se puede deshacer.`,
      () => {
        // Esta función se ejecuta cuando el usuario confirma
        handleEliminarProducto(producto.idProducto);
      },
      {
        titulo: "Eliminar Producto",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  }

  // función para cancelar eliminación
  function cancelarEliminacion() {
    setProductoAEliminar(null);
    confirmacionEliminar.ocultarConfirmacion();
  }

  // función para eliminar producto
  async function handleEliminarProducto(idProducto) {
    try {
      await eliminarProductoServicio(idProducto);
      
      // Actualizar la lista localmente sin recargar toda la página
      refetch();
      
      // Mostrar mensaje de éxito
      mostrarAlerta.exito('Producto eliminado exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    } finally {
      // Limpiar el estado
      setProductoAEliminar(null);
    }
  }

  // función para recargar productos después de guardar
  function handleGuardarProducto() {
    refetch();
    modalNuevoProducto.cerrar();
    modalEditarProducto.cerrar();
  }

  // Aplicar búsqueda 
  let productosFiltrados = filtrarPorBusqueda(productos, [
    "nombreProducto", 
    "descripcionProducto"
  ]);

  const { datosPaginados, totalPaginas } = paginar(productosFiltrados);

  // Mapear los productos para las filas de la tabla
  const filasProductos = datosPaginados.map((producto) => (
    <FilaProducto 
      key={producto.idProducto} // Cambiado de id a idProducto
      producto={producto}
      onGestionarInsumos={handleGestionarInsumos} // Cambiado de onVerReceta
      onEditarProducto={handleEditarProducto}
      onEliminarProducto={handleSolicitarEliminar} 
    />
  ));

  // Mostrar estado de carga
  if (cargando) {
    return (
      <div className="p-2">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-2">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">Error al cargar productos: {error}</p>
          <button
            onClick={refetch}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <BsBoxSeam className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Administra los productos del menú y sus recetas</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre o descripción..."
          />
          <button 
            onClick={handleNuevoProducto}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
            + Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla de productos - CORREGIDO encabezados */}
      <Tabla
        encabezados={["PRODUCTO", "PRECIO", "USA INSUMOS", "ESTADO", "GESTIÓN INSUMOS", "ACCIONES"]}
        registros={filasProductos}
      />

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />

      {/* Modal para gestionar insumos */}
      <Modal
        estaAbierto={modalReceta.estaAbierto}
        onCerrar={modalReceta.cerrar}
        titulo={`Insumos: ${productoSeleccionado?.nombreProducto || ''}`}
        tamaño="xl"
        mostrarHeader={true}
      >
        {productoSeleccionado && (
          <ModalReceta 
            producto={productoSeleccionado}
            onClose={modalReceta.cerrar}
            onGuardar={refetch} 
          />
        )}
      </Modal>

      {/* Modal para agregar un nuevo producto */}
      <Modal
        estaAbierto={modalNuevoProducto.estaAbierto}
        onCerrar={modalNuevoProducto.cerrar}
        titulo="Agregar Nuevo Producto"
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalNuevoProducto 
          onClose={modalNuevoProducto.cerrar}
          onGuardar={handleGuardarProducto} // Cambiado para recargar productos
        />
      </Modal>

      {/* Modal para editar producto */}
      <Modal
        estaAbierto={modalEditarProducto.estaAbierto}
        onCerrar={modalEditarProducto.cerrar}
        titulo={`Editar Producto: ${productoSeleccionado?.nombreProducto || ''}`}
        tamaño="lg"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {productoSeleccionado && (
          <ModalEditarProducto 
            producto={productoSeleccionado}
            onClose={modalEditarProducto.cerrar}
            onGuardar={handleGuardarProducto} // Cambiado para recargar productos
          />
        )}
      </Modal>
      <div className="p-2">
        {/* Modal de confirmación para eliminar */}
        <ModalConfirmacion
          visible={confirmacionEliminar.confirmacionVisible}
          onCerrar={cancelarEliminacion}
          onConfirmar={confirmacionEliminar.confirmarAccion}
          titulo={confirmacionEliminar.tituloConfirmacion}
          mensaje={confirmacionEliminar.mensajeConfirmacion}
          tipo={confirmacionEliminar.tipoConfirmacion}
          textoConfirmar={confirmacionEliminar.textoConfirmar}
          textoCancelar={confirmacionEliminar.textoCancelar}
        />
      </div>
    </div>
  );
};

export default GestionProductosSeccion;