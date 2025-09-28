import { useState } from "react";

export const usePaginacion = (itemsPorPagina = 5) => { // recibe un parametro, si no se pasa ningun valor toma el 5
  const [paginaActual, setPaginaActual] = useState(1);
  // función para paginar
  const paginar = (items) => { // item son todos los elementos 
    const totalPaginas = Math.ceil(items.length / itemsPorPagina); // calculamos el total de paginas dividiendo el total de registros y cuantos deben haber y lo redondemos hacia arriba
    const inicio = (paginaActual - 1) * itemsPorPagina; // calculamos el indice del primer elemento que se debe mostrar en la página actual
    const datosPaginados = items.slice(inicio, inicio + itemsPorPagina); // tomamos un subarreglo de los elementos a mostrar en la página actual

    return { datosPaginados, totalPaginas }; // devolvemos el subarreglo y el numero total de páginas
  };
  // se devuelve el estado y la función
  return { paginaActual, setPaginaActual, paginar };
};
