// librerías
import { BsBoxSeam } from "react-icons/bs";
// hook de react
import { useState, useEffect } from "react";
// servicios
import { listarInsumoServicio } from "../servicios/insumosServicios";
// importar componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; // La barra de busqueda del componente reutilizable
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda"; // otro componente reutilizable
import { Paginacion } from "../../../componentes/tabla/Paginacion"; // la paginación para la tabla
import Modal from "../../../componentes/modal/Modal";
// custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; // hook para la la busqueda 
import { useFiltro } from "../../../hooks/useFiltro"; // hook para filtrar por tipo
import { usePaginacion } from "../../../hooks/usePaginacion"; // hook para la paginas de nuestra tabla
import { useModal } from "../../../hooks/useModal";
// componentes de la seccion
import { FilaInsumo } from "../componentes/FilaInsumo"; // nuestras filsa personalizadas
import { ModalNuevoInsumo } from "../componentes/ModalNuevoInsumo";
import { ModalMovimientoStock } from "../componentes/ModalMovimientoStock";
import { ModalEditarStock } from "../componentes/ModalEditarStock";

const StockInsumosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); // utilizamos nuestro hook de busqueda, lo desestructuramos
  const { filtro, setFiltro, aplicarFiltros } = useFiltro(); // lo mismo para el filtro
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8); // tambien para la paginación
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null); // estado para insumo seleccionado
  const [ insumos, setInsumos ] = useState([]) // estado para los insumos
  const [ error, setError ] = useState(null); // estado para errores
  // Modal para nuevo insumo
  const modalNuevoInsumo = useModal(false);
  const modalMovimientoStock = useModal(false);
  const modalEditarStock = useModal(false); // modal para editar stock
  // useEffect para cargar los insumos al montar el componente
  useEffect(() => {
    const obtenerInsumos = async () => {
      try {
        const respuesta = await listarInsumoServicio(); // Llamada al servicio
        setInsumos(respuesta.data); // Asumimos que respuesta es un array de insumos
      } catch (error) {
        setError("Error al obtener los insumos");
        console.error(error);
      }
    };
    obtenerInsumos();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(insumos, [
    "nombreInsumo",
    "unidadMedida",
    "categoriaProducto"
  ]);
  // Aplicar filtros adicionales
  filtrados = aplicarFiltros(filtrados, "categoriaProducto");
  const { datosPaginados, totalPaginas } = paginar(filtrados);
  // Función para abrir modal de nuevo insumo
  const handleNuevoInsumo = () => {
    modalNuevoInsumo.abrir();
  };
  // Función para abrir modal de movimiento de stock
  const handleMovimientoStock = () => {
    modalMovimientoStock.abrir();
  };
  // Función para abrir modal de edición
  const handleEditarStock = (insumo) => {
    setInsumoSeleccionado(insumo);
    modalEditarStock.abrir();
  };
  // Mapear los insumos para las filas de la tabla
  const filasInsumos = datosPaginados.map((insumo) => (
    <FilaInsumo 
      key={insumo.idInsumo} 
      insumo={insumo} 
      onEditarStock={handleEditarStock}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <BsBoxSeam className="mr-3 text-2xl text-gray-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock de los Insumos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Gestión de materia prima y bebidas</p>
      </div>
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por nombre de insumo, unidad o categoría..."
          />
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={[
              { value: "todos", label: "Todos los insumos" },
              { value: "insumo", label: "Solo insumos" },
              { value: "bebida", label: "Solo bebidas" },
            ]}
          />
          <div className="flex gap-2">
            {/* Botón para movimiento de stock */}
            <button 
              onClick={handleMovimientoStock}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <BsBoxSeam className="text-lg" />
              Movimiento Stock
            </button>
            
            {/* Botón para nuevo insumo */}
            <button 
              onClick={handleNuevoInsumo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              + Nuevo Insumo
            </button>
          </div>
        </div>
      </div>
      {/* Tabla de insumos */}
      <Tabla
        encabezados={["Insumo", "Categoría", "Stock Actual", "Unidad", "Estado Stock", "Acciones"]}
        registros={filasInsumos}
      /> 
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />
      {/* Modal para nuevo insumo */}
      <Modal
        estaAbierto={modalNuevoInsumo.estaAbierto}
        onCerrar={modalNuevoInsumo.cerrar}
        titulo="Agregar Nuevo Insumo"
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalNuevoInsumo 
          onClose={modalNuevoInsumo.cerrar}
          onGuardar={modalNuevoInsumo.cerrar}
        />
      </Modal>
      {/* Modal para movimiento de stock */}
      <Modal
        estaAbierto={modalMovimientoStock.estaAbierto}
        onCerrar={modalMovimientoStock.cerrar}
        titulo="Registrar Movimiento de Stock"
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalMovimientoStock 
          onClose={modalMovimientoStock.cerrar}
          onGuardar={modalMovimientoStock.cerrar}
        />
      </Modal>
      {/* Modal para editar stock */}
      <Modal
        estaAbierto={modalEditarStock.estaAbierto}
        onCerrar={modalEditarStock.cerrar}
        titulo={`Editar Stock: ${insumoSeleccionado?.nombreInsumo || ''}`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {insumoSeleccionado && (
          <ModalEditarStock 
            insumo={insumoSeleccionado}
            onClose={modalEditarStock.cerrar}
            onGuardar={modalEditarStock.cerrar}
          />
        )}
      </Modal>
    </div>
  );
};

export default StockInsumosSeccion;