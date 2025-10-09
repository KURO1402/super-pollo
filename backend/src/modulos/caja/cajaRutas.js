const { crearCajaController, cerrarCajaController } = require('./cajaControlador');
const router = require('express').Router();

router.post('/abrir-caja', crearCajaController);
router.post('/cerrar-caja', cerrarCajaController);

module.exports = router;