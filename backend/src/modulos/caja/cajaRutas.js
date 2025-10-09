const { crearCajaController } = require('./cajaControlador');
const router = require('express').Router();

router.post('/abrir-caja', crearCajaController)

module.exports = router;