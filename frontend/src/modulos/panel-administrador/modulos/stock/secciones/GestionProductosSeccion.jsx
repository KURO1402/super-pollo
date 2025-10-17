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
// componentes de la seccion
import { ModalReceta } from '../componentes/ModalReceta';
import { FilaProducto } from '../componentes/FilaProductos';
// datos temporales
import { productos } from '../data-temporal/productos';

const GestionProductosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModalReceta, setMostrarModalReceta] = useState(false);

  // Aplicar búsqueda
  let productosFiltrados = filtrarPorBusqueda(productos, [
    "nombre",
    "categoria"
  ]);

  // Aplicar filtros adicionales
  productosFiltrados = aplicarFiltros(productosFiltrados, "categoria");

  const { datosPaginados, totalPaginas } = paginar(productosFiltrados);

  // Mapear los productos para las filas de la tabla
  const filasProductos = datosPaginados.map((producto) => (
    <FilaProducto 
      key={producto.id} 
      producto={producto}
      onVerReceta={handleVerReceta}
    />
  ));
  // funcion que escucha el evente de ver receta
  function handleVerReceta(producto) {
    setProductoSeleccionado(producto);
    setMostrarModalReceta(true);
  }
// funcion para cerrar el modal de receta
  function handleCerrarModal() {
    setMostrarModalReceta(false);
    setProductoSeleccionado(null);
  }

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Productos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra los productos del menú y sus recetas
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre o código..."
          />
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
            + Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <Tabla
        encabezados={[ "PRODUCTO", "CATEGORÍA", "PRECIO", "ESTADO", "RECETA", "ACCIONES"]}
        registros={filasProductos}
      />

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />

      {/* Modal de Receta */}
      <Modal
        estaAbierto={mostrarModalReceta}
        onCerrar={handleCerrarModal}
        titulo={`Receta: ${productoSeleccionado?.nombre || ''}`}
        tamaño="xl"
      >
        {productoSeleccionado && (
          <ModalReceta 
            producto={productoSeleccionado}
            onClose={handleCerrarModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default GestionProductosSeccion;