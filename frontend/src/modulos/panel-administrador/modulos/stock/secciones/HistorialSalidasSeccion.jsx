// librerías
import { MdHistory } from "react-icons/md";
// hooks de react
import { useEffect, useState } from "react";
// importamos nuestros componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
// tambien los custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; 
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
// importamos los componentes que solo vana a servir para construir esta sección
import { FilaSalida } from "../componentes/FilaSalida";
import { ModalSalidaStock } from "../componentes/ModalSalidaStock";
// servicios del backend 
import { listarMovimientosServicio } from "../servicios/movientosStockServicio";
import { listarInsumoServicio } from "../servicios/insumosServicios";

const HistorialSalidasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  
  // modal para salida de stock
  const modalSalidaStock = useModal(false);

  // Obtener movimientos del backend
  const obtenerMovimientos = async () => {
    try {
      const data = await listarMovimientosServicio();
      setMovimientos(data);
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

  // Filtrar solo salidas
  const salidas = movimientos.filter(mov => mov.tipoMovimiento === 'salida');

  // función para abrir modal de salida
  const handleSalidaStock = (salida) => {
    setSalidaSeleccionada(salida);
    modalSalidaStock.abrir();
  };

  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(salidas, [
    "nombreInsumo",
    "idMovimientoStock",
    "cantidadMovimiento"
  ]);

  // Aplicar filtro por insumo (si no es "todos")
  if (filtro !== "todos") {
    filtrados = filtrados.filter(salida => 
      salida.nombreInsumo === filtro
    );
  }

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Generar opciones de insumos para el filtro
  const opcionesInsumos = [
    { value: "todos", label: "Todos los insumos" },
    ...insumos.map(insumo => ({
      value: insumo.nombreInsumo,
      label: insumo.nombreInsumo
    }))
  ];

  // Mapear las salidas para las filas de la tabla
  const filasSalidas = datosPaginados.map((salida) => (
    <FilaSalida 
      key={salida.idMovimientoStock} 
      salida={salida} 
      onSalidaStock={handleSalidaStock}
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
      
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, ID movimiento o cantidad..."
          />
          
          {/* Filtro por insumo */}
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={opcionesInsumos}
          />
        </div>
      </div>
      
      {/* Tabla de salidas */}
      <Tabla
        encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Acciones"]}
        registros={filasSalidas}
      /> 
      
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />
      
      <Modal
        estaAbierto={modalSalidaStock.estaAbierto}
        onCerrar={modalSalidaStock.cerrar}
        titulo={`Salida de Stock: ${salidaSeleccionada?.nombreInsumo || ''}`}
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        {salidaSeleccionada && (
          <ModalSalidaStock 
            salida={salidaSeleccionada}
            onClose={modalSalidaStock.cerrar}
            onGuardar={modalSalidaStock.cerrar}
          />
        )}
      </Modal>
    </div>
  );
};

export default HistorialSalidasSeccion;