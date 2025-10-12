// importar componentes reutilizables
import { Tabla } from "../../../componentes/tabla/Tabla";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; // La barra de busqueda del componente reutilizable
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda"; // otro componente reutilizable
import { Paginacion } from "../../../componentes/tabla/Paginacion"; // la paginación para la tabla
// custom hooks
import { useBusqueda } from "../../../hooks/useBusqueda"; // hook para la la busqueda 
import { useFiltro } from "../../../hooks/useFiltro"; // hook para filtrar por tipo
import { usePaginacion } from "../../../hooks/usePaginacion"; // hook para la paginas de nuestra tabla
// componente y data temporal
import { FilaInsumo } from "../componentes/FilaInsumo"; // nuestras filsa personalizadas
import { insumos } from "../data-temporal/insumos"; // data temporal para hacer el diseño

const StockInsumosSeccion = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); // utilizamos nuestro hook de busqueda, lo desestructuramos
  const { filtro, setFiltro, aplicarFiltros } = useFiltro(); // lo mismo para el filtro
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(8); // tambien para la paginación
  // Aplicar búsqueda
  let filtrados = filtrarPorBusqueda(insumos, [
    "nombreinsumo",
    "unidadMedida",
    "categoriaProducto"
  ]);
  // Aplicar filtros adicionales
  filtrados = aplicarFiltros(filtrados, "categoriaProducto");
  const { datosPaginados, totalPaginas } = paginar(filtrados);
  // Mapear los insumos para las filas de la tabla
  const filasInsumos = datosPaginados.map((insumo) => (
    <FilaInsumo key={insumo.idInsumo} insumo={insumo} />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock de los Insumos</h1>
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
    </div>
  );
};

export default StockInsumosSeccion;