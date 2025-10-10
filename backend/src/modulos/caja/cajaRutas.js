const { crearCajaController, cerrarCajaController, registrarIngresoCajaController, registrarEgresoCajaController } = require('./cajaControlador');
const router = require('express').Router();

router.post('/abrir-caja', crearCajaController);
router.post('/cerrar-caja', cerrarCajaController);
router.post('/ingreso-caja', registrarIngresoCajaController);
router.post('/egreso-caja', registrarEgresoCajaController);

module.exports = router;