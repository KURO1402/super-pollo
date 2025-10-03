import { DetalleVenta } from "../componentes/DetalleVenta";
import { FormularioComprobante } from "../componentes/FormularioComprobante";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";

const NuevoComprobanteSeccion = () => {
  const { detalle } = useVentaEstadoGlobal(); // detalle para poder mandar los productos como item

  // función submit
  const handleComprobanteSubmit = (data) => {
    // Formatear fecha para enviar al backend ya que tiene otra estructura
    const fechaParts = data.fechaDeEmision.split("-");
    const fechaEmision = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

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
      serie: data.serie,
      fechaEmision,
      moneda: Number(data.moneda),
      items,
    };
    console.log("datos cliente: ", data.datosCliente);// para verificar, 
    // Si hay datos completos desde el modal
    if (data.datosCliente) {
      comprobante.datosCliente = {
        clienteTipoDocumento: Number(data.datosCliente.tipoDocumento),
        clienteNumeroDocumento: data.datosCliente.numeroDocumento,
        clienteNombre: data.datosCliente.nombre,
        clienteNombreComercial: data.datosCliente.nombreComercial || "",
        clienteDireccion: data.datosCliente.direccion || "",
        clienteTelefono: data.datosCliente.telefono || "",
        clienteEmail: data.datosCliente.email || "",
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