const { obtenerMovimientosPorVentaModel, registrarMovimientoStockModel } = require("../../modulos/inventario/modelo/movimientosModelo");
const { obtenerMovimientosCajaPorVentaModel, registrarEgresoCajaModel } = require("../../modulos/caja/cajaModelo")

const restaurarCajaStock = async (idVenta, idUsuario) => {

    const movimientos = await obtenerMovimientosPorVentaModel(idVenta, idUsuario);

    if (movimientos.length > 0) {
        for (const movimiento of movimientos) {
            await registrarMovimientoStockModel(
                movimiento.idInsumo,
                movimiento.cantidadMovimiento,
                "entrada",
                "Anulación de comprobante",
                idUsuario,
                idVenta
            );
        }
    }

    const movimientoCaja = await obtenerMovimientosCajaPorVentaModel(idVenta);
    if (!movimientoCaja) {
        throw Object.assign(
            new Error("No existe ningún registro de caja para esta venta."),
            { status: 404 }
        );
    }

    await registrarEgresoCajaModel(
        { monto: movimientoCaja.montoMovimiento, descripcion: "Anulación de comprobante" },
        idUsuario, idVenta
    );

    return {
        ok: true,
        mensaje: "Venta anulada correctamente.",
        detalles: {
            insumosRestaurados: movimientos.length,
            montoDevueltoCaja: movimientoCaja.montoMovimiento
        }
    };
};

module.exports = restaurarCajaStock;