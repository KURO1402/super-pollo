import { useState } from "react";
// para filtrar por estado
export const useFiltro = (valorInicial = "todos") => { // por defecto iniciara en todos
  const [filtro, setFiltro] = useState(valorInicial); // inicializamos los estados
  // funcion de filtro
  const aplicarFiltros = (items, campo = "estado") => { //se pasa los parametros, por defecto estado
    if (filtro === "todos") return items; // si el filtro es todos devolvemos todos los registros
    return items.filter((item) => item[campo] === filtro); // sino devolvemos todos los registros filtrados
  };
  // devolvemos los estados y la funcion
  return { filtro, setFiltro, aplicarFiltros };
};