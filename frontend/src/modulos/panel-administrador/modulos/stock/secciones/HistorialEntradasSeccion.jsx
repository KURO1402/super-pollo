// librerias 
import { MdHistory } from "react-icons/md";
// hook de react
import { useEffect, useState } from "react";
// importar componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
import { ModalConfirmacion } from "../../../componentes/modal/ModalConfirmacion";
import { alertasCRUD } from "../../../../../utilidades/toastUtilidades";
// importar custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; 
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
import { useConfirmacion } from "../../../hooks/useConfirmacion";
// importar componentes de su propio módulo
import { FilaEntrada } from "../componentes/FilaEntrada";
import { ModalEntradaStock } from "../componentes/ModalEntradaStock";
// servicios del backend 
import { listarMovimientosServicio } from "../servicios/movientosStockServicio";
import { eliminarInsumoServicio, listarInsumoServicio } from "../servicios/insumosServicios"; 

const HistorialEntradasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  const [movimientos, setMovimientos] = useState([]); 
  const [insumos, setInsumos] = useState([]);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);
  
  // modal para entrada de stock
  const modalEntradaStock = useModal(false);
  const confirmacionEliminar = useConfirmacion();

  // Obtener movimientos del backend
  const obtenerMovimientos = async () => {
    try {
      const data = await listarMovimientosServicio();
      const movimientosConId = data.map((mov, index) => ({
        ...mov,
        idMovimientoStock: `mov-${index}-${Date.now()}`, // ID temporal único
        idMovimiento: `mov-${index}-${Date.now()}` // ID temporal único
      }));

      setMovimientos(movimientosConId);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    }
  };

  // Obtener insumos del backend
  const obtenerInsumos = async () => {
    try {
      const respuesta = await listarInsumoServicio();
      setInsumos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
    obtenerInsumos();
  }, []);

  // Filtrar solo entradas
  const entradas = movimientos.filter(mov => mov.nombreMovimiento === 'entrada');

  // Función para abrir modal de entrada
  const handleEntradaStock = (entradas) => {
    setEntradaSeleccionada(entradas);
    modalEntradaStock.abrir();
  };

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(entradas, [
    "nombreInsumo",
    "cantidadMovimiento",
    "detalleMovimiento",
    "nombreUsuario"
  ]);

  // Aplicar filtro por insumo (si no es "todos")
  if (filtro !== "todos") {
    filtrados = filtrados.filter(entrada => 
      entrada.nombreInsumo === filtro
    );
  }

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Generar opciones de insumos para el filtro
  /* const opcionesInsumos = [
    { value: "todos", label: "Todos los insumos" },
    ...insumos.map(insumo => ({
      value: insumo.nombreInsumo,
      label: insumo.nombreInsumo
    }))
  ]; */

  // Función para solicitar confirmación de eliminación
  const solicitarConfirmacionEliminar = (movimiento) => {
    setMovimientoAEliminar(movimiento);
    
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar la entrada de "${movimiento.nombreInsumo}"? Esta acción no se puede deshacer.`,
      () => {
        handleEliminarMovimiento(movimiento.idMovimientoStock);
      },
      {
        titulo: "Eliminar Entrada",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  // Función para eliminar movimiento
  const handleEliminarMovimiento = async (idMovimiento) => {
    try {
      await eliminarInsumoServicio(idMovimiento);
      
      // Actualizar estado local
      setMovimientos(prev => prev.filter(mov => mov.idMovimientoStock !== idMovimiento));
      
      alertasCRUD.eliminado();
      
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      alertasCRUD.error("Error al eliminar la entrada");
    } finally {
      setMovimientoAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setMovimientoAEliminar(null);
    confirmacionEliminar.ocultarConfirmacion();
  };

  // Mapear las entradas para las filas de la tabla
  const filasEntradas = datosPaginados.map((entrada) => (
    <FilaEntrada 
      key={entrada.idMovimientoStock} 
      entrada={entrada} 
      onEntradaStock={handleEntradaStock}
      onEliminarMovimiento={solicitarConfirmacionEliminar}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <MdHistory className="text-3xl text-green-500 dark:text-green-400 mr-2"/>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Entradas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Registro de compras e ingresos de insumos</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, ID movimiento o cantidad..."
          />
          
          {/* Filtro por insumo */}
          {/* <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={opcionesInsumos}
          /> */}
        </div>
      </div>

      <Tabla
        encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Usuario", "Acciones"]}
        registros={filasEntradas}
      /> 
      
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />
      
      <Modal
        estaAbierto={modalEntradaStock.estaAbierto}
        onCerrar={modalEntradaStock.cerrar}
        titulo={`Entrada de Stock: ${entradaSeleccionada?.nombreInsumo || ''}`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {entradaSeleccionada && (
          <ModalEntradaStock 
            entrada={entradaSeleccionada}
            onClose={modalEntradaStock.cerrar}
            onGuardar={modalEntradaStock.cerrar}
          />
        )}
      </Modal>
      <div className="p-2">
      {/* Modal de confirmación */}
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

export default HistorialEntradasSeccion;