const { crearCajaController, cerrarCajaController, registrarIngresoCajaController, registrarEgresoCajaController, registrarArqueoCajaController } = require('./cajaControlador');
const router = require('express').Router();

router.post('/abrir-caja', crearCajaController);
router.post('/cerrar-caja', cerrarCajaController);
router.post('/ingreso-caja', registrarIngresoCajaController);
router.post('/egreso-caja', registrarEgresoCajaController);
router.post('/arqueo-caja', registrarArqueoCajaController);

module.exports = router;