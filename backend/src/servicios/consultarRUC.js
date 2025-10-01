// Importamos axios
const axios = require("axios");

// Función para consultar DNI
const consultarRUC = async (ruc) => {
    // Token
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlhdXJpcGFibG83MEBnbWFpbC5jb20ifQ.Igfne0Cqzdxnt7Hrvz0QcNPFvhAOlQTPkRe-fHli21M";
    try {
        const url = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`;

        const respuesta = await axios.get(url);

        return respuesta.data; // Retorna los datos del DNI
    } catch (error) {
        console.error("Error al consultar el RUC:", error.message);
        throw error;
    }
};

// Exportamos la función
module.exports = { consultarRUC };
