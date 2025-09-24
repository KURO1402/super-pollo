const { listarTipoDocumentoModel } = require("./fuenteDatosModelo.js");

const listarTipoDocumentoService = async () => {
    const tipo = await listarTipoDocumentoModel();

    //verificar si existe al menos 1 tipo documento
    if (!tipo || tipo.length === 0) {
        throw Object.assign(new Error("No se encontraron tipos de documento"), { status: 404 });
    }

    return tipo;
};

module.exports = { listarTipoDocumentoService };
