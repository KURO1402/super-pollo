import axios from "axios";

// URL base del backend
const API_URL = "http://localhost:3001"; 

// Función que obtiene los tipos de documento
export const obtenerTiposDocumento = async () => {
  const respuesta = await axios.get(`${API_URL}/fuente-datos/tipos-documentos`);
  if(!respuesta.data.ok){
     throw new Error(respuesta.data.mensaje || "Error al obtener los tipos de documento");
  }
  return respuesta.data.tiposDoc;
};
