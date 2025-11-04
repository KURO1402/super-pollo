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

const registrarBoletaVentaController = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const datosVenta = req.body;

        const resultado = await registrarBoletaVentaService(datosVenta, token);

        return res.status(201).json(resultado);

    } catch (err) {
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
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor",
        });
    }
};

const obtenerVentaController = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 20;

        const resultado = await obtenerVentasService(pagina, limite);

        return res.status(200).json({
            ok: true,
            ...resultado
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            ok: false,
            mensaje: err.message || "Error interno en el servidor"
        });
    }
};

const obtenerVentaIDController = async (req, res) => {
    try {
        const idVenta = req.params.id;

        const venta = await obtenerVentasIDService(idVenta);

        if (!venta) {
            return res.status(404).json({
                ok: false,
                mensaje: "Venta no encontrada"
            });
        }

        return res.status(200).json({
            ok: true,
            venta
        });

    } catch (err) {
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
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerEstadosSunatController = async (req, res) => {
    try {
        const estados = await obtenerEstadosSunatService();
        res.status(200).json({ ok: true, estados: estados });
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({ ok: false, mensaje: err.message });
    }
};

const obtenerMediosPagoController = async (req, res) => {
    try {
        const medios = await obtenerMediosPagoService();
        res.status(200).json({ ok: true, medios });
    } catch (err) {
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
    const statusCode = err.status || 500;
    res.status(statusCode).json({ ok: false, mensaje: err.message });
  }
};

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