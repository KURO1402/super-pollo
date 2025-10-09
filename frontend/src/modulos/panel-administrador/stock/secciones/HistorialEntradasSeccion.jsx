import { Tabla } from "../../componentes/tabla/Tabla";
import { FilaEntrada } from "../componentes/FilaEntrada";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../componentes/tabla/Paginacion";
import { useBusqueda } from "../../hooks/useBusqueda"; 
import { useFiltro } from "../../hooks/useFiltro";
import { usePaginacion } from "../../hooks/usePaginacion";
import { entradas } from "../data-temporal/entradas";

const HistorialEntradasSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8);

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
    <FilaEntrada key={entrada.idMovimiento} entrada={entrada} />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Entradas</h1>
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
    </div>
  );
};

export default HistorialEntradasSeccion;