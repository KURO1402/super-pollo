const { insertarDetalleVentaModel } = require("../../modulos/ventas/modelo/ventasModelo");
const { obtenerProductoPorIdModel, obtenerInsumosPorProductoModel } = require("../../modulos/inventario/modelo/productoModelo");
const { registrarMovimientoStockModel } = require("../../modulos/inventario/modelo/movimientosModelo")
const procesarProductosYInsumos = async (productos, dataFormateada, respuestaVenta, idUsuario, idVenta) => {
  const resultados = {
    detallesVenta: [],
    movimientosStock: [],
    errores: []
  };

  const operacionesProductos = productos.map(async (producto, index) => {
    try {
      const { idProducto, cantidad } = producto;
      const item = dataFormateada.items[index];

      const rptaDetalle = await insertarDetalleVentaModel({
        cantidadProducto: cantidad,
        valorUnitario: item.valor_unitario,
        precioUnitario: item.precio_unitario,
        subtotal: item.subtotal,
        igv: item.igv,
        totalProducto: item.total,
        idVenta: respuestaVenta.idVenta,
        idProducto: idProducto
      });

      resultados.detallesVenta.push({
        idProducto,
        detalleVenta: rptaDetalle
      });

      const productoInfo = await obtenerProductoPorIdModel(idProducto);
      if (productoInfo.usaInsumos === 1) {
        const insumos = await obtenerInsumosPorProductoModel(idProducto);

        const operacionesInsumos = insumos.map(async (insumo) => {

          const cantidadTotalInsumo = cantidad * insumo.cantidadUso;

          const respuestaMovimiento = await registrarMovimientoStockModel(
            insumo.idInsumo,
            cantidadTotalInsumo,
            "salida",
            "Venta",
            idUsuario,
            idVenta
          );

          resultados.movimientosStock.push({
            idInsumo: insumo.idInsumo,
            idProducto: idProducto,
            cantidadVendida: cantidad,
            cantidadUsoInsumo: insumo.cantidadUso,
            cantidadTotalInsumo: cantidadTotalInsumo,
            movimiento: respuestaMovimiento
          });

          return respuestaMovimiento;
        });

        await Promise.all(operacionesInsumos);
      }
    } catch (error) {
      resultados.errores.push({
        idProducto: producto.idProducto,
        error: error.message
      });
      throw error; 
    }
  });

  await Promise.all(operacionesProductos);
  return resultados;
};

const prepararDatosVenta = (dataFormateada, datosVenta, respuestaNubefact, idUsuario) => {
  return {
    numeroDocumentoCliente: dataFormateada.cliente_numero_de_documento,
    nombreCliente: dataFormateada.cliente_denominacion,
    fechaEmision: dataFormateada.fecha_de_emision,
    fechaVencimiento: dataFormateada.fecha_de_emision,
    porcentajeIGV: dataFormateada.porcentaje_de_igv,
    totalGravada: dataFormateada.total_gravada,
    totalIGV: dataFormateada.total_igv,
    totalVenta: dataFormateada.total,
    idMedioPago: datosVenta.idMetodoPago,
    idTipoComprobante: respuestaNubefact.tipo_de_comprobante,
    idUsuario: idUsuario,
    numeroCorrelativo: respuestaNubefact.numero,
    enlaceNubefact: respuestaNubefact.enlace,
    urlComprobantePDF: respuestaNubefact.enlace_del_pdf,
    urlComprobanteXML: respuestaNubefact.enlace_del_xml,
    codigoHash: respuestaNubefact.codigo_hash,
    keyNubefact: respuestaNubefact.key,
    aceptadaPorSunat: respuestaNubefact.aceptada_por_sunat ? 1 : 0,
    estadoSunat: respuestaNubefact.sunat_description || null,
    sunatResponseCode: respuestaNubefact.sunat_responsecode || null
  };
};

module.exports = {
  procesarProductosYInsumos,
  prepararDatosVenta
}