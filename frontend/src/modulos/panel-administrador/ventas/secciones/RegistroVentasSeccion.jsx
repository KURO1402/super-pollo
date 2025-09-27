import { useState } from "react";
import { comprobantes } from "../data-temporal/comprobantes";

import { Tabla } from "../../componentes/tabla/Tabla";
import { FilaComprobante } from "../componentes/FilaComprobante";  // Importamos el componente personalizado
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda"; 
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { Paginacion } from "../../componentes/tabla/Paginacion";

const RegistroVentasSeccion = () => {
  const [paginaActual, setPaginaActual] = useState(1); // estado para la página actual
  const itemsPorPagina = 5; // Por ahora solo 5

  // estado para el filtro de estado del comprobante y el termino de busqueda
  const [filtroEstado, setFiltroEstado] = useState("todos");
  // estado para el trrmino de busqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // filtramos los comprobantes según el término de búsqueda y el filtro de estado
  const comprobantesFiltrados = comprobantes.filter((c) => {
    // verificamos si el comprobante coincide con el término de busqueda y el filtro de estado
    const coincideBusqueda =
      c.serie.toLowerCase().includes(terminoBusqueda.toLowerCase()) || // buscamos en serie
      c.correlativo.toLowerCase().includes(terminoBusqueda.toLowerCase()) || // buscamos en correlativo
      c.cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) || // en cliente
      c.rucDni.includes(terminoBusqueda); // en ruc/dni
    // verificamos si el comprobante coincide con el filtro de estado
    const coincideEstado = filtroEstado === "todos" || c.estado === filtroEstado;
    // retornamos true si coincide con ambos filtros
    return coincideBusqueda && coincideEstado;
  });

  // aplica paginacion
  const totalPaginas = Math.ceil(comprobantesFiltrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const comprobantesPaginados = comprobantesFiltrados.slice(inicio, inicio + itemsPorPagina);

  // Mapeamos los comprobantes a filas personalizadas
  const filasComprobantes = comprobantesPaginados.map((comprobante) => (
    <FilaComprobante key={comprobante.id} comprobante={comprobante} /> 
  ));

  return (
    <div className="p-6">
      <div className="mb-6">
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
            valor={filtroEstado}
            onChange={setFiltroEstado} 
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
