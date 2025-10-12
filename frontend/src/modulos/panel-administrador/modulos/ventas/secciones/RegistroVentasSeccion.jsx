import { comprobantes } from "../data-temporal/comprobantes";
import { Tabla } from "../../../componentes/tabla/Tabla";
import { FilaComprobante } from "../componentes/FilaComprobante";  // Importamos el componente personalizado
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../../componentes/tabla/Paginacion";
// importamos los hooks que vamos a utilizar
import { useBusqueda } from "../../../hooks/useBusqueda"; 
import { useFiltro } from "../../../hooks/useFiltro";
import { usePaginacion } from "../../../hooks/usePaginacion";

const RegistroVentasSeccion = () => {
  // desestructuramos los hooks para extraer los valores o funciones de cada uno
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const { paginaActual, setPaginaActual, paginar } = usePaginacion(5);
  // utilizamos la función de useBusqueda, donde le pasamos los parametros de comprobantes para item y los campos
  let filtrados = filtrarPorBusqueda(comprobantes, [
    "serie",
    "correlativo",
    "cliente",
    "rucDni", 
  ]);
  filtrados = aplicarFiltros(filtrados); // utilizamos la funcion para aplicar los filtros

  const { datosPaginados, totalPaginas } = paginar(filtrados); // llamamos a la funcion de paginar y le enviamos los datos filtrados
  // nos devuelde los datoPaginados y el total de paginas y las guardamos
  // mapeamos los comprobantes para que se muestren en la tabla, con los datos Paginados
  const filasComprobantes = datosPaginados.map((c) => (
    <FilaComprobante key={c.id} comprobante={c} />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Ventas</h1>
        <p className="text-gray-600 dark:text-gray-400">Historial de comprobantes electrónicos</p>
      </div>
      {/* le enviamos los estados y funciones para actualizar los estados al componente de busqueda y filtro */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Barra de búsqueda */}
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por serie, correlativo, cliente o RUC/DNI..."
          />
  
          {/* Filtro por estado */}
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro} 
            opciones={[
              { value: "todos", label: "Todos los estados" },
              { value: "aceptado", label: "Aceptados" },
              { value: "denegado", label: "Denegados" },
            ]}
          />
        </div>
      </div>
      
      {/* le enviamos las filas personalizadas a la tabla */}
      <Tabla
        encabezados={["Comprobante", "Cliente", "Fechas", "Total", "Estado SUNAT", "Acciones"]}
        registros={filasComprobantes} // pasamos los comprobantes mapeados 
      /> 
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        alCambiarPagina={setPaginaActual}
      />
    </div>
  );
};

export default RegistroVentasSeccion;