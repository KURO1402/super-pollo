import axios from "axios";

// URL base del backend
const apiUrl = import.meta.env.VITE_BACKEND_URL; 

// Función que obtiene los tipos de documento
export const obtenerTiposDocumento = async () => {
  const respuesta = await axios.get(`${apiUrl}/fuente-datos/tipos-documentos`);
  if(!respuesta.data.ok){
     throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de documento");
  }
  return respuesta.data.tiposDoc;
};