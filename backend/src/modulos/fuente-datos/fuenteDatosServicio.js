const {
    listarTipoDocumentoModel,
    topProductosMasVendidosModel
} = require("./fuenteDatosModelo.js");

const listarTipoDocumentoService = async () => {
    const tipos = await listarTipoDocumentoModel();

    //verificar si existe al menos 1 tipo documento
    if (!tipos || tipos.length === 0) {
        throw Object.assign(new Error("No se encontraron tipos de documento"), { status: 404 });
    }

    return tipos;
};

const topProductosMasVendidosService = async (fechaInicio, fechaFin) => {
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
        throw Object.assign(
            new Error("Debe proporcionar ambas fechas o ninguna."),
            { status: 400 }
        );
    }
    const fechaIni = fechaInicio || null;
    const fechaFi = fechaFin || null;


    const resultado = await topProductosMasVendidosModel(fechaIni, fechaFi);

    return {
        ok: true,
        resultado: resultado
    };
};

module.exports = { 
    listarTipoDocumentoService,
    topProductosMasVendidosService
};
