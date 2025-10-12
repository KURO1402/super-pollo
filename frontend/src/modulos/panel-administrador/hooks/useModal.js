import { useState } from "react"; // importamos react para manejar si el modal esta abierto o no
// creamos el custom hook para el modal
export const useModal = (estadoInicial = false) => { // como prop vamos a tener el estado Inicial, si no hay le colocamos como falso
  const [estaAbierto, setEstaAbierto] = useState(estadoInicial); // colocamos esa prop para inicializar el estado

  const abrir = () => setEstaAbierto(true); // función de abrir, cambia el estado a true, para que sea visible
  const cerrar = () => setEstaAbierto(false); // lo contrario a lo que esta arriba
  const alternar = () => setEstaAbierto(!estaAbierto); // altenar, cambio al contrario de lo que esta actualmente

  return {estaAbierto, abrir, cerrar, alternar}; // retornamos las funciones y el estado para poder utilizarlas en otros componentes
};