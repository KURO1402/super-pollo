const axios = require("axios");

const generarComprobanteNubefact = async (data) => {
    const urlnubeFact = "https://api.nubefact.com/api/v1/017d0c63-24c8-4634-adea-5793973da0e6";
    const token = "51b40a8683394ab1a147abfe04a538868d535726b6374f2e90aba544a7500190";
    
    try {
        console.log("Enviando a Nubefact:", JSON.stringify(data, null, 2)); // Para debug

        const response = await axios.post(urlnubeFact, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token token=${token}`,
            },
        });

        console.log("Respuesta de Nubefact:", response.data); // Para debug
        return response.data;

    } catch (error) {
        if (error.response) {
            console.error("Error Nubefact - Status:", error.response.status);
            console.error("Error Nubefact - Data:", error.response.data);
            // Retornamos el error para que el servicio lo maneje
            return error.response.data;
        } else {
            console.error("Error de conexión:", error.message);
            throw error;
        }
    }
}

module.exports = {
    generarComprobanteNubefact
}