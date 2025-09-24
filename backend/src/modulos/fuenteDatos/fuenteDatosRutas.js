const express = require("express");
const { listarTipoDocumentoController } = require("./fuenteDatosControlador.js")

const router = express.Router();

//ruta para obtener los tipos de documento
router.get("/tipos-documentos", listarTipoDocumentoController);

module.exports = router;