// librerías
import { BsBoxSeam } from "react-icons/bs";
// hook de react
import { useState } from 'react';
// componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda";
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from '../../../componentes/modal/Modal';
// custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda";
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useProductos } from "../hooks/useProductos";
// componentes de la seccion
import { ModalReceta } from '../componentes/ModalReceta';
import { ModalNuevoProducto } from '../componentes/ModalNuevoProducto'
import { FilaProducto } from '../componentes/FilaProductos';
import { ModalEditarProducto } from "../componentes/ModalEditarProducto";
// datos temporales

const GestionProductosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { productos, cargando, error, refetch } = useProductos();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // modales
  const modalReceta = useModal(false);
  const modalNuevoProducto = useModal(false);
  const modalEditarProducto = useModal(false);

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

  // función para eliminar producto
  function handleEliminarProducto(producto) {
    if (confirm(`¿Estás seguro de eliminar "${producto.nombreProducto}"?`)) {
      console.log('Eliminar producto:', producto);
      // Aquí llamarías al servicio de eliminar producto
      // await eliminarProductoServicio(producto.idProducto);
      // refetch(); // Recargar la lista después de eliminar
    }
  }

  // función para recargar productos después de guardar
  function handleGuardarProducto() {
    refetch();
    modalNuevoProducto.cerrar();
    modalEditarProducto.cerrar();
  }

  // Aplicar búsqueda - CORREGIDO para usar las propiedades correctas
  let productosFiltrados = filtrarPorBusqueda(productos, [
    "nombreProducto", // Cambiado de "nombre" a "nombreProducto"
    "descripcionProducto" // Agregado para buscar también en descripción
  ]);
  
  // productosFiltrados = aplicarFiltros(productosFiltrados, "categoria");

  const { datosPaginados, totalPaginas } = paginar(productosFiltrados);

  // Mapear los productos para las filas de la tabla - CORREGIDO
  const filasProductos = datosPaginados.map((producto) => (
    <FilaProducto 
      key={producto.idProducto} // Cambiado de id a idProducto
      producto={producto}
      onGestionarInsumos={handleGestionarInsumos} // Cambiado de onVerReceta
      onEditarProducto={handleEditarProducto}
      onEliminarProducto={handleEliminarProducto} // Agregado
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
          {/* Filtro temporalmente comentado hasta que tengamos categorías
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro}
            opciones={[
              { value: "todos", label: "Todas las categorías" },
              { value: "Platos principales", label: "Platos principales" },
              { value: "Bebidas", label: "Bebidas" },
              { value: "Entradas", label: "Entradas" },
              { value: "Postres", label: "Postres" },
            ]}
          />
          */}
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
            onGuardar={refetch} // Recargar después de guardar insumos
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
    </div>
  );
};

export default GestionProductosSeccion;