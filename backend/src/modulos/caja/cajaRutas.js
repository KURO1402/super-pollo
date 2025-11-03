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

const { autenticacionToken, verificarRoles } = require("../../middlewares/autenticacionMiddleware");
const router = require('express').Router();

router.post('/abrir-caja', autenticacionToken, verificarRoles(1, 2), crearCajaController);
router.post('/cerrar-caja', autenticacionToken, verificarRoles(1, 2), cerrarCajaController);
router.post('/ingreso-caja', autenticacionToken, verificarRoles(1, 2), registrarIngresoCajaController);
router.post('/egreso-caja', autenticacionToken, verificarRoles(1, 2), registrarEgresoCajaController);
router.post('/arqueo-caja', autenticacionToken, verificarRoles(1, 2), registrarArqueoCajaController);
router.get('/movimientos-caja/:idCaja', autenticacionToken, verificarRoles(1, 2), obtenerMovimientosPorCajaController);
router.get('/movimientos-caja', autenticacionToken, verificarRoles(1, 2), obtenerMovimientosCajaController);
router.get('/registros-caja', autenticacionToken, verificarRoles(1, 2), obtenerCajasController);
router.get('/arqueos-caja', autenticacionToken, verificarRoles(1, 2), obtenerArqueosCajaController);
router.get('/arqueos-caja/:idCaja', autenticacionToken, verificarRoles(1, 2), obtenerArqueosPorCajaController);

module.exports = router;