const { listarTipoDocumentoModel } = require("./fuenteDatosModelo.js");

const listarTipoDocumentoService = async () => {
    const tipos = await listarTipoDocumentoModel();

    //verificar si existe al menos 1 tipo documento
    if (!tipos || tipos.length === 0) {
        throw Object.assign(new Error("No se encontraron tipos de documento"), { status: 404 });
    }

    return tipos;
};

module.exports = { listarTipoDocumentoService };
