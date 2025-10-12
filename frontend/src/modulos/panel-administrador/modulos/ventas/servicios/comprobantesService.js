import axios from "axios";
// extraer la url base de nuestras variables de entorno
const apiUrl = import.meta.env.VITE_BACKEND_URL;
// función para traer los tipos de comprobante desde el backend
export const obtenerTiposComprobantes = async () => {
    // hacemos la consulta y lo guardamos en una variable
    const respuesta = await axios.get(`${apiUrl}/ventas/tipos-comprobantes`)
    // si la respuesta ok es diferente a true 
    if(!respuesta.data.ok){
        // mostramos un error
        throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de comprobantes");
    }
    // retornamos la respuesta con el array que nos da todos los tipos de comprobante
    return respuesta.data.tiposComprobantes;
}