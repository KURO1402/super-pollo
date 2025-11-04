require("dotenv").config();
const axios = require("axios");

const generarComprobanteNubefact = async (data) => {
    const urlnubeFact = process.env.NUBEFACT_URL;
    const token = process.env.NUBEFACT_TOKEN;

    if (!urlnubeFact || !token) {
        throw new Error("Las variables de entorno NUBEFACT_URL o NUBEFACT_TOKEN no están definidas");
    }

    try {
        const response = await axios.post(urlnubeFact, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token token=${token}`,
            },
        });

        return response.data;

    } catch (error) {
        if (error.response) {
            console.error("Error Nubefact - Status:", error.response.status);
            console.error("Error Nubefact - Data:", error.response.data);
<<<<<<< HEAD
=======
            
>>>>>>> refactor/limpieza-codigo-comentarios
            return error.response.data;
        } else {
            console.error("Error de conexión:", error.message);
            throw error;
        }
    }
};

module.exports = {
    generarComprobanteNubefact
};
