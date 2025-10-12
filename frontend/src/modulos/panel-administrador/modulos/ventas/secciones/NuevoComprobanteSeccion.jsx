import { DetalleVenta } from "../componentes/DetalleVenta";
import { FormularioComprobante } from "../componentes/FormularioComprobante";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

const NuevoComprobanteSeccion = () => {
  const { detalle, total } = useVentaEstadoGlobal(); // detalle para poder mandar los productos como item

  // función submit
  const handleComprobanteSubmit = (data) => {

    // Mapear items desde el estado global del detalle por cada producto
    const items = detalle.map((item) => {
      const idProducto = item.id;
      return {
        idProducto: idProducto,
        cantidad: item.cantidad,
      };
    });
    // para armar todo lo que se va a mandar al backend
    const comprobante = {
      tipoDeComprobante: Number(data.tipoComprobante),
      clienteDenominacion: data.clienteDenominacion,
      total: total(),
      items,
    };
    console.log("datos cliente: ", data.datosCliente);// para verificar, 
    // Si hay datos completos desde el modal
    if (data.datosCliente) {
      comprobante.datosCliente = {
        tipoDoc: Number(data.datosCliente.tipoDocumento),
        numeroDoc: data.datosCliente.numeroDocumento,
        nombre: data.datosCliente.nombre,
        nombreComercial: data.datosCliente.nombreComercial || "",
        direccion: data.datosCliente.direccion || "",
        telefono: data.datosCliente.telefono || "",
        email: data.datosCliente.email || "",
      };
    }
    console.log("Datos para enviar al backend:", comprobante);// mostramos por consola
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