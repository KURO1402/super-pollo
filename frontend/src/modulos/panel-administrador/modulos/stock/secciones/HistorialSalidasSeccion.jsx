// librerías
import { MdHistory } from "react-icons/md";
// hooks de react
import { useState } from "react";
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
// la data temporal solo para el diseño
import { salidas } from "../data-temporal/salidas";

const HistorialSalidasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); // lo mismo, desestructuración del estado y la función del hook
  const { filtro, setFiltro, aplicarFiltros } = useFiltro(); // tambien para el hook de filtro
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8); // de igual manera para la paginación
  const [ salidaSeleccionada, setSalidaSeleccionada] = useState(null); // estado para la salida seleccionada
  // modal para salida de stock
  const modalSalidaStock = useModal(false);
  // función para abrir modal de salida
  const handleSalidaStock = (salidas) => {
    setSalidaSeleccionada(salidas);
    modalSalidaStock.abrir();
  };
  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(salidas, [
    "nombreInsumo",
    "detallesMovimiento",
    "usuario",
    "unidadMedida"
  ]);
  // Aplicar filtros por unidad de medida
  filtrados = aplicarFiltros(filtrados, "unidadMedida");
  const { datosPaginados, totalPaginas } = paginar(filtrados);
  // Mapear las salidas para las filas de la tabla
  const filasSalidas = datosPaginados.map((salida) => (
    <FilaSalida 
      key={salida.idMovimiento} 
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
            placeholder="Buscar por insumo, detalles, usuario o unidad..."
          />
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={[
              { value: "todos", label: "Todas las unidades" },
              { value: "kg", label: "Kilogramos (kg)" },
              { value: "lt", label: "Litros (lt)" },
              { value: "unid", label: "Unidades (unid)" },
              { value: "saco", label: "Sacos" },
              { value: "balde", label: "Baldes" },
            ]}
          />
        </div>
      </div>
      {/* Tabla de salidas */}
      <Tabla
        encabezados={["Insumo", "Cantidad", "Fecha", "Detalles", "Usuario", "Acciones"]}
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
        titulo={`Salida de Stock: ${modalSalidaStock?.nombreInsumo || ''}`}
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