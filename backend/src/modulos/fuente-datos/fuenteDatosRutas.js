const express = require("express");
const { 
    listarTipoDocumentoController, 
    topProductosMasVendidosController  
} = require("./fuenteDatosControlador.js")

const router = express.Router();

//ruta para obtener los tipos de documento
router.get("/tipos-documentos", listarTipoDocumentoController);

router.get("/top-productos", topProductosMasVendidosController);

module.exports = router;