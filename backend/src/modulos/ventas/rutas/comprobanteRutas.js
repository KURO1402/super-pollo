const express = require("express");
const { listarTiposComprobantes } = require("../controlador/comprobanteControlador");
const { autenticacionToken, verificarRoles } = require("../../../middlewares/autenticacionMiddleware");

const router = express.Router();


// Ruta para listar tipos de comprobantes
router.get("/tipos-comprobantes",autenticacionToken, verificarRoles(1,2), listarTiposComprobantes); 

module.exports = router;