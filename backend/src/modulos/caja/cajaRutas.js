const { crearCajaController, cerrarCajaController, registrarIngresoCajaController, registrarEgresoCajaController, registrarArqueoCajaController, obtenerMovimientosPorCajaController, obtenerUltimosMovimientosCajaController, obtenerCajasCerradasController } = require('./cajaControlador');
const router = require('express').Router();

router.post('/abrir-caja', crearCajaController);
router.post('/cerrar-caja', cerrarCajaController);
router.post('/ingreso-caja', registrarIngresoCajaController);
router.post('/egreso-caja', registrarEgresoCajaController);
router.post('/arqueo-caja', registrarArqueoCajaController);
router.get('/movimientos-caja/:idCaja', obtenerMovimientosPorCajaController);
router.get('/movimientos-caja', obtenerUltimosMovimientosCajaController);
router.get('/registros-caja', obtenerCajasCerradasController);

module.exports = router;