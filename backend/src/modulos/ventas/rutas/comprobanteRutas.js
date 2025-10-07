const express = require("express");
const { listarTiposComprobantes } = require("../controlador/comprobanteControlador");

const router = express.Router();

// Ruta para listar tipos de comprobantes
router.get("/tipos-comprobantes", listarTiposComprobantes); 

module.exports = router;