require('dotenv').config(); 
const helmet = require("helmet");
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const limitador = require("./src/middlewares/limitador");

const autenticacionRoutes = require("./src/modulos/autenticacion/autenticacionRutas");

const fuenteDatosRouter = require("./src/modulos/fuente-datos/fuenteDatosRutas");


const ventasRoutes = require("./src/modulos/ventas/rutas/ventasRutas");
const comprobanteRoutes = require("./src/modulos/ventas/rutas/comprobanteRutas");

const reservacionesRoutes = require("./src/modulos/reservaciones/reservacionesRutas.js");

const insumoRoutes = require("./src/modulos/inventario/rutas/insumoRutas");
const inentarioRoutes = require("./src/modulos/inventario/rutas/movimientoRutas.js");

const cajaRoutes = require("./src/modulos/caja/cajaRutas.js");

const productoRoutes = require("./src/modulos/inventario/rutas/productoRutas");

const usuariosRoutes = require("./src/modulos/usuarios/usuarioRutas")

const app = express();

/* app.set('trust proxy', true); */

app.use(limitador);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3001;


app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});


app.use('/api/ventas', ventasRoutes);
app.use('/api/comprobantes', comprobanteRoutes);
app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/fuente-datos', fuenteDatosRouter);
app.use('/api/insumos', insumoRoutes);
app.use('/api/inventario', inentarioRoutes);
app.use('/api/reservaciones', reservacionesRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuariosRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
