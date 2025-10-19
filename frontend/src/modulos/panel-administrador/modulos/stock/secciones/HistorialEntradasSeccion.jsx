//librerias 
import { MdHistory } from "react-icons/md";
// hook de react
import { useState } from "react";
// importar componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
import Modal from "../../../componentes/modal/Modal";
// importar custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; 
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useModal } from "../../../hooks/useModal";
// importar componentes de su propio módulo (que no van a ser utilizados en otras partes)
import { FilaEntrada } from "../componentes/FilaEntrada";
import { ModalEntradaStock } from "../componentes/ModalEntradaStock";
// data temporal que se eliminará, cuando se empieze a traer datos del backend
import { entradas } from "../data-temporal/entradas";

const HistorialEntradasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);
  const [ entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  // modal para entrada de stock
  const modalEntradaStock = useModal(false);
  // Función para abrir modal de entrada
  const handleEntradaStock = (entradas) => {
    setEntradaSeleccionada(entradas);
    modalEntradaStock.abrir();
  };
  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(entradas, [
    "nombreInsumo",
    "detallesMovimiento",
    "usuario",
    "unidadMedida"
  ]);

  // Aplicar filtros por unidad de medida
  filtrados = aplicarFiltros(filtrados, "unidadMedida");

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  // Mapear las entradas para las filas de la tabla
  const filasEntradas = datosPaginados.map((entrada) => (
    <FilaEntrada 
      key={entrada.idMovimiento} 
      entrada={entrada} 
      onEntradaStock={handleEntradaStock}
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
      <Tabla
        encabezados={["Insumo", "Cantidad", "Fecha", "Detalles", "Usuario", "Acciones"]}
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
    </div>
  );
};

export default HistorialEntradasSeccion;