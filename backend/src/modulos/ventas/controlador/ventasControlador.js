// Importamos los servicios
const {
    registrarBoletaVentaService,
    registrarFacturaVentaService,
    anularComprobanteService
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
}

//Exportamos
module.exports = {
    registrarBoletaVentaController,
    registrarFacturaVentaController,
    obtenerVentaController,
    obtenerVentaIDController,
    anularComprobanteController
};