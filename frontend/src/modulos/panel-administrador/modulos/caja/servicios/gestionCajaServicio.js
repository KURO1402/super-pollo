import axios from 'axios';

export const abrirCajaServicio = async (data, token) => {
  console.log("datos obtenidos (servicio): ", data);

  const respuesta = await axios.post('http://localhost:3001/caja/abrir-caja', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!respuesta.data.ok) {
    throw new Error(respuesta.data.mensaje || "Error al abrir una caja");
  }

  return respuesta.data.mensaje;
};

export const cerrarCajaServicio = async (token) => {
  console.log("token obtenido cerrar caja (servicio): ", token);
  const respuesta = await axios.post('http://localhost:3001/caja/cerrar-caja', {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!respuesta.data.ok) {
    throw new Error(respuesta.data.mensaje || "Error al cerrar una caja");
  }

  return respuesta.data.mensaje;
};
