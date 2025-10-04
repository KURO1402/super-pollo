import axios from "axios";
// el token que nos da el microservicio
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImpodWFyb2NjdGFwaWFAZ21haWwuY29tIn0.hrw0-vFTNavUfY8AaI9rqYWqqIJKHe1x_pqGqmgeGEo";

// Funcion que busca un DNI en Apisperu
export const buscarPorDNI = async (dni) => { // recibe como parametro el dni
  if (!/^\d{8}$/.test(dni)) { // verificamos que siga la estructura correcta
    throw new Error("El DNI debe tener 8 dígitos"); // mensaje de error
  } // armamos el end point completo con el dni y el token
  const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${TOKEN}`; // 
  const respuesta = await axios.get(url); // almacenamos al respuesta en esa variable
  return respuesta.data; // retornamos la respuesta para poder utilizarla en otro componente
};

// Función que busca un RUC en Apisperu, y lo mismo que el anterior
export const buscarPorRUC = async (ruc) => {
  if (!/^\d{11}$/.test(ruc)) {
    throw new Error("El RUC debe tener 11 dígitos");
  }
  const url = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${TOKEN}`;
  const respuesta = await axios.get(url);
  return respuesta.data;
};
