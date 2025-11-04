const axios = require("axios");

const generarComprobanteNubefact = async (data) => {
    const urlnubeFact = "https://api.nubefact.com/api/v1/69a5b70b-56f6-404a-818c-cc50aee07376";
    const token = "0cc4cffe30254fb1ac920d5dc6bbf47e7b9ba7fcf72c4210aa433812e575e0d8";
    
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