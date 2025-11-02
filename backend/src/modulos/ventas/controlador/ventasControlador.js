// Importamos los servicios
const {
    registrarBoletaVentaService,
    registrarFacturaVentaService,
    anularComprobanteService,
    obtenerResumenVentasService,
    obtenerResumenVentaPorIdService,
    obtenerResumenVentasPorRangoFechaService,
    obtenerResumenVentasPorNombreUsuarioService,
    obtenerVentasPorComprobanteService,
    obtenerResumenVentasPorAceptacionSunatService,
    obtenerEstadosSunatService,
    obtenerMediosPagoService,
    obtenerDetalleVentaPorIdVentaService,
    obtenerComprobantePorIdVentaService 
} = require("../servicio/ventasServicio");

//Registrar ventas
const registrarBoletaVentaController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const datosVenta = req.body;

        const resultado = await registrarBoletaVentaService(datosVenta, token);

        return res.status(201).json(resultado);

    } catch (err) {
        console.error("Error en Registrar venta(Controlador)", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const registrarFacturaVentaController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const datosVenta = req.body;

        const resultado = await registrarFacturaVentaService(datosVenta, token);

        return res.status(201).json(resultado);

    } catch (err) {
        console.error("Error en registrarFacturaVentaController:", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

//Obtenr ventas con paginacion
const obtenerVentaController = async (req, res) => {
    try {
        // 1. Obtenemos parámetros de paginación (query params ?pagina=1&limite=20)
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 20;

        // 2. Llamamos al servicio
        const resultado = await obtenerVentasService(pagina, limite);

        // 3. Respondemos con las ventas
        return res.status(200).json({
            ok: true,
            ...resultado
        });

    } catch (err) {
        console.error("Error en obtener ventas controller:", err.message);
        return res.status(err.status || 500).json({
            ok: false,
            mensaje: err.message || "Error interno en el servidor"
        });
    }
};

//obtener ventas por ID
const obtenerVentaIDController = async (req, res) => {
    try {
        //1. capturamos el desde los parametro de al ruta
        const idVenta = req.params.id;

        //2. Lamamos al servicio
        const venta = await obtenerVentasIDService(idVenta);

        //3. Si no existe devolvemos 404
        if (!venta) {
            return res.status(404).json({
                ok: false,
                mensaje: "Venta no encontrada"
            });
        }

        //4. Respuesta exitosa
        return res.status(200).json({
            ok: true,
            venta
        });

    } catch (err) {
        console.error("Error al obtener ventas por ID (controlador)", err.message);
        return res.status(err.status || 500).json({
            ok: false,
            mensaje: err.message || "Error interno en el servidor"
        });
    }
};

const anularComprobanteController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const datosAnular = req.body;

        const resultado = await anularComprobanteService(datosAnular, token);

        return res.status(201).json(resultado);

    } catch (err) {
        console.error("Error en Registrar anularComprobanteController: ", err.message);
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerResumenVentasController = async (req, res) => {

    try {
        const ventas = await obtenerResumenVentasService(req.query.limit, req.query.offset);
        res.status(200).json({ ok: true, ventas });
    } catch (err) {
        console.error("Error en obtenerResumenVentasController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerResumenVentaPorIdController = async (req, res) => {
    const { idVenta } = req.params;

    try {
        const venta = await obtenerResumenVentaPorIdService(idVenta);
        res.status(200).json({ ok: true, venta });
    } catch (err) {
        console.error("Error en obtenerResumenVentaPorIdController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerResumenVentasPorRangoFechaController = async (req, res) => {
    const { fechaInicio, fechaFin, limit, offset } = req.query;

    try {
        const ventas = await obtenerResumenVentasPorRangoFechaService(fechaInicio, fechaFin, limit, offset);
        res.status(200).json({ ok: true, ventas });
    } catch (err) {
        console.error("Error en obtenerResumenVentasPorRangoFechaController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerResumenVentasPorNombreUsuarioController = async (req, res) => {
    const { nombre, limit, offset } = req.query;

    try {
        const ventas = await obtenerResumenVentasPorNombreUsuarioService(nombre, limit, offset);
        res.status(200).json({ ok: true, ventas });
    } catch (err) {
        console.error("Error en obtenerResumenVentasPorNombreUsuarioController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerVentasPorComprobanteController = async (req, res) => {
    const { comprobante, limit, offset } = req.query;

    try {
        const ventas = await obtenerVentasPorComprobanteService(comprobante, limit, offset);
        res.status(200).json({ ok: true, ventas });
    } catch (err) {
        console.error("Error en obtenerVentasPorComprobanteController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerResumenVentasPorAceptacionSunatController = async (req, res) => {
    const aceptadaSunat = parseInt(req.query.aceptadaSunat);
    const { limit, offset } = req.query;

    try {
        const ventas = await obtenerResumenVentasPorAceptacionSunatService(aceptadaSunat, limit, offset);
        res.status(200).json({ ok: true, ventas });
    } catch (err) {
        console.error("Error en obtenerResumenVentasPorAceptacionSunatController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerEstadosSunatController = async (req, res) => {
    try {
        const estados = await obtenerEstadosSunatService();
        res.status(200).json({ ok: true, estados: estados });
    } catch (err) {
        console.error("Error en obtenerResumenVentasPorAceptacionSunatController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerMediosPagoController = async (req, res) => {
    try {
        const medios = await obtenerMediosPagoService();
        res.status(200).json({ ok: true, medios });
    } catch (err) {
        console.error("Error en obtenerMediosPagoController:", err.message);
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerDetalleVentaPorIdVentaController = async (req, res) => {
  const { idVenta } = req.params;

  try {
    const detalle = await obtenerDetalleVentaPorIdVentaService(idVenta);
    res.status(200).json({ ok: true, detalles: detalle });
  } catch (err) {
    console.error("Error en obtenerDetalleVentaPorIdVentaController:", err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ ok: false, mensaje: err.message });
  }
};

const obtenerComprobantePorIdVentaController = async (req, res) => {
  const { idVenta } = req.params;

  try {
    const comprobante = await obtenerComprobantePorIdVentaService(idVenta);
    res.status(200).json({ ok: true, comprobante: comprobante });
  } catch (err) {
    console.error("Error en obtenerComprobantePorIdVentaController:", err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ ok: false, mensaje: err.message });
  }
};


//Exportamos
module.exports = {
    registrarBoletaVentaController,
    registrarFacturaVentaController,
    obtenerVentaController,
    obtenerVentaIDController,
    anularComprobanteController,
    obtenerResumenVentasController,
    obtenerResumenVentaPorIdController,
    obtenerResumenVentasPorRangoFechaController,
    obtenerResumenVentasPorNombreUsuarioController,
    obtenerVentasPorComprobanteController,
    obtenerResumenVentasPorAceptacionSunatController,
    obtenerEstadosSunatController,
    obtenerMediosPagoController,
    obtenerDetalleVentaPorIdVentaController,
    obtenerComprobantePorIdVentaController
};