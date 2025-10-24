const express = require("express");
const verificarImagen = require("../../middlewares/verificarImagenMiddleware"); 
const cloudinaryService = require("../../servicios/cloudinary");


const router = express.Router();

router.post('/cargar-imagen', verificarImagen, cloudinaryService);

module.exports = router;
