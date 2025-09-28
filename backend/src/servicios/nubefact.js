const axios = require("axios");

const generarComprobanteNubefact = async (data) => {
    const urlnubeFact = "https://api.nubefact.com/api/v1/017d0c63-24c8-4634-adea-5793973da0e6";
    const token = "51b40a8683394ab1a147abfe04a538868d535726b6374f2e90aba544a7500190"
    try {

        const response = await axios.post(urlnubeFact, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token token=${token}`,
            },
        });

        return response.data
    } catch (error) {
        if (error.response) {
            console.error("Error Nubefact:", error.response.data);
        } else {
            console.error("Error de conexión:", error.message);
        }
    }
}

MediaSourceHandle.exports = {
    generarComprobanteNubefact
}
