const {
  crearCajaController,
  cerrarCajaController,
  registrarIngresoCajaController,
  registrarEgresoCajaController,
  registrarArqueoCajaController,
  obtenerMovimientosPorCajaController,
  obtenerMovimientosCajaController,
  obtenerCajasController,
  obtenerArqueosCajaController,
  obtenerArqueosPorCajaController
} = require('./cajaControlador');

const autenticacionToken = require("../../middlewares/autenticacionMiddleware");
const router = require('express').Router();

router.post('/abrir-caja', autenticacionToken, crearCajaController);
router.post('/cerrar-caja', autenticacionToken, cerrarCajaController);
router.post('/ingreso-caja', autenticacionToken, registrarIngresoCajaController);
router.post('/egreso-caja', autenticacionToken, registrarEgresoCajaController);
router.post('/arqueo-caja', autenticacionToken, registrarArqueoCajaController);
router.get('/movimientos-caja/:idCaja', autenticacionToken, obtenerMovimientosPorCajaController);
router.get('/movimientos-caja', autenticacionToken, obtenerMovimientosCajaController);
router.get('/registros-caja', autenticacionToken, obtenerCajasController);
router.get('/arqueos-caja', autenticacionToken, obtenerArqueosCajaController);
router.get('/arqueos-caja/:idCaja', autenticacionToken, obtenerArqueosPorCajaController);

module.exports = router;