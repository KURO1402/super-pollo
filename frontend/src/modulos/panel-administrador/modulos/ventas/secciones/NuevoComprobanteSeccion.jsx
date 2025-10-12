import { DetalleVenta } from "../componentes/DetalleVenta";
import { FormularioComprobante } from "../componentes/FormularioComprobante";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";
import { registrarVenta } from "../servicios/ventasServicio";

const NuevoComprobanteSeccion = () => {
  const { detalle, total } = useVentaEstadoGlobal(); // detalle para poder mandar los productos como item

  // función submit
  const handleComprobanteSubmit = async (data) => {

    // Mapear productos desde el estado global del detalle por cada producto
    const productos = detalle.map((item) => {
      const idProducto = item.id;
      return {
        idProducto: idProducto,
        cantidad: item.cantidad,
      };
    });
    // para armar todo lo que se va a mandar al backend
    const comprobante = {
      tipoComprobante: Number(data.tipoComprobante),
      /* clienteDenominacion: data.clienteDenominacion, */
      /* total: total(), */
      productos,
    };
    console.log("datos cliente: ", data.datosCliente);// para verificar, 
    // Si hay datos completos desde el modal
    if (data.datosCliente) {
      comprobante.datosCliente = {
        tipoDoc: Number(data.datosCliente.tipoDocumento),
        numeroDoc: data.datosCliente.numeroDocumento,
        nombreCliente: data.datosCliente.nombre,
        /* nombreComercial: data.datosCliente.nombreComercial || "",
        direccion: data.datosCliente.direccion || "",
        telefono: data.datosCliente.telefono || "",
        email: data.datosCliente.email || "", */
      };
    }
    console.log("datos que se van a mandar al backend:", comprobante);
    const ventaRegistrada = await registrarVenta(comprobante); // utilizamos la función de registrar venta
    // si el usuario se registro correctamente
    if (ventaRegistrada){
      console.log("Registro correcto", ventaRegistrada)
    }
  };
  // solo renderizamos el formulario y el detalle, es más simplificado
  return (
    <>
      <FormularioComprobante alEnviar={handleComprobanteSubmit} />
      <DetalleVenta />
    </>
  );
};

export default NuevoComprobanteSeccion;