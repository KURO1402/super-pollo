import { useState } from "react"; // importamos este hook para manejar los estados del término

// creamos el custom hook para poder reutilizarlo en otras partes
export const useBusqueda = (claveBusqueda = "") => { // resive un parametro, vacio por defecto, para iniciar este hook
    const [terminoBusqueda, setTerminoBusqueda] = useState(claveBusqueda);// el estado se inicializa con el valor del parámetro
    // creamos la función de busqueda que recibe como parametros el arreglo de elementos que se desea filtrar y las propiedades de cada item que se desea filtrar
    const filtrarPorBusqueda = (items, campos) => {
        return items.filter((item) => // filter devuelve un nuevo areglo con los valores que cumplan una condicion 
            campos.some((campo) => // usamos some para devolver true si al menos un elemento cumple con la condición
                // verificamos que el valor del campo en los objetos item contiene el termino
                String(item[campo]).toLowerCase().includes(terminoBusqueda.toLowerCase())
                // primero verificamos que sea una cadena de texto, accedemos al valor de la propiedad y verificamos si ese valor incluye el termino que estamos buscando
            )
        );
    };
  // devolvemos el valor actual del estado, el stado para actualizar y la función
  return { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda };
};
