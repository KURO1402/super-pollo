// Importamos axios
const axios = require("axios");

// Función para consultar DNI
const consultarDNI = async (dni) => {
    // Token
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlhdXJpcGFibG83MEBnbWFpbC5jb20ifQ.Igfne0Cqzdxnt7Hrvz0QcNPFvhAOlQTPkRe-fHli21M";
    try {
        const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`;

        const respuesta = await axios.get(url);

        return respuesta.data; // Retorna los datos del DNI
    } catch (error) {
        console.error("Error al consultar el DNI:", error.message);
        throw error;
    }
};

// Exportamos la función
module.exports = { consultarDNI };
