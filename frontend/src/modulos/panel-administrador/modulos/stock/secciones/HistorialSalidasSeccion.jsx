// librerias 
import { MdHistory } from "react-icons/md";
// hook de react
import { useEffect, useState } from "react";
// importar componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; 
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
// importar custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; 
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
// importar componentes de su propio módulo
import { FilaSalida } from "../componentes/FilaSalida"; 
// servicios del backend 
import { listarMovimientosServicio } from "../servicios/movientosStockServicio";
import { BsPlusLg } from "react-icons/bs";
import { ModalMovimientoStock } from "../componentes/ModalMovimientoStock";

const HistorialSalidasSeccion = () => {
  const { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina, 
    setItemsPorPagina, 
    paginar 
  } = usePaginacion(5);

  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const modalMovimientoStock = useModal(false);

  // Obtener movimientos del backend
  const obtenerMovimientos = async () => {
    try {
      setCargando(true);
      const data = await listarMovimientosServicio();
      const movimientosConId = data.map((mov, index) => ({
        ...mov,
        idMovimientoStock: `mov-${index}-${Date.now()}`, // ID temporal único
        idMovimiento: `mov-${index}-${Date.now()}` // ID temporal único
      }));

      setMovimientos(movimientosConId);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  // Filtrar solo entradas
  const salidas = movimientos.filter(mov => mov.nombreMovimiento === 'salida');

  // Función para abrir modal de movimiento de stock
  const handleMovimientoStock = () => {
    modalMovimientoStock.abrir();
  };

  // CORREGIDO: Esta función se ejecuta cuando se crea un nuevo movimiento
  const handleMovimientoCreado = async () => {
    try {
      // Dar tiempo al backend para procesar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recargamos la lista completa desde el backend
      await obtenerMovimientos();
      
      // Cerrar modal
      modalMovimientoStock.cerrar();
    } catch (error) {
      console.error("Error al actualizar la lista:", error);
    }
  };

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(salidas, [
    "nombreInsumo",
    "cantidadMovimiento",
    "detalleMovimiento",
    "nombreUsuario"
  ]);

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Función para manejar cambio de página
  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  // Función para manejar cambio de items por página
  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  // Mapear las entradas para las filas de la tabla
  const filasSalidas = datosPaginados.map((salida) => (
    <FilaSalida
      key={salida.idMovimientoStock} 
      salida={salida}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <MdHistory className="text-3xl text-red-600 dark:text-red-500 mr-2"/>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Salidas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Registro de consumos y ventas de insumos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="md:col-span-2">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, ID movimiento o cantidad..."
          />
        </div>
        <button 
          onClick={handleMovimientoStock}
          className="bg-transparent hover:bg-red-500 text-red-600 hover:text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm border-2 border-red-500 hover:border-red-600"
        >
          <BsPlusLg className="text-lg flex-shrink-0" />
          <span className="truncate">Nueva Salida</span>
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando salidas...</p>
        </div>
      ) : (
        <>
          <Tabla
            encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Usuario", "Detalle"]}
            registros={filasSalidas}
          /> 
          
          {datosPaginados.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {salidas.length === 0 ? "No hay salidas registradas" : "No se encontraron entradas que coincidan con la búsqueda"}
            </div>
          )}
          
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={handleCambiarPagina}
            itemsPorPagina={itemsPorPagina}
            alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
            mostrarSiempre={true}
          />
        </>
      )}
      
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
          onGuardar={handleMovimientoCreado}
        />
      </Modal>
    </div>
  );
};

export default HistorialSalidasSeccion;