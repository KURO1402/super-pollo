import { useForm } from "react-hook-form";
import { DetalleVenta } from "../componentes/DetalleVenta";
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";
import { useState } from "react";

const NuevoComprobanteSeccion = () => {

  const { detalle } = useVentaEstadoGlobal(); // detalle para poder mandar los productos como item
  const { abierto, setAbierto } = useState(false)

  function alternarDesplegable() {
    setAbierto(!abierto);
  }

  function cerrarDesplegable() {
    setAbierto(false);
  }

  const hoy = new Date()
  const fechaFormateada = hoy.toISOString().split("T")[0]; // formatear fecha

  // inicializamos react-hook-form
  const{
    register,
    handleSubmit,
    watch,  
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoComprobante: 2,
      tipoDocumento: 1,
      serie: 'B001',
      numeroDocumento: "",
      cliente_denominacion: "Cliente Varios",
      observaciones: "",
      fechaDeEmision: fechaFormateada,
      moneda: 1,
      tipoCambio: "",
    },
  });

  const tipo = watch("tipoComprobante")

  // función submit
  const onSubmit = (data) => {
    // Formatear fecha para enviar al backend ya que tiene otra estructura
    const fechaParts = data.fechaDeEmision.split("-");
    const fechaEmision = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

    // Mapear items desde el estado global del detalle
    const items = detalle.map((item) => {
      const idProducto = item.id;
      return {
        idProducto: idProducto,
        nombreProducto: item.nombre,
        precioProducto: item.precio,
        cantidad: item.cantidad,
      };
    });
    const comprobante = {
      tipoDeComprobante: Number(data.tipoComprobante),
      datosCliente : {
        clienteTipoDocumento: Number(data.tipoDocumento), 
        clienteNumeroDocumento: (data.numeroDocumento),
      },
      serie: data.serie,
      fechaEmision,
      moneda: Number(data.moneda),
      items,
    };
    console.log("Datos para enviar al backend:", comprobante);
  };

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white dark:bg-gray-900 p-4"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Nuevo Comprobante
        </h1>
      </div>

      {/* Primera fila: Tipo Operación y Tipo de Comprobante */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Comprobante
          </label>
          <select
            {...register("tipoComprobante", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>FACTURA</option>
            <option value={2}>BOLETA</option>
          </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serie</label>
            <input
              {...register("serie", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ tipo == 2 ? 'B001':'F001'}
              disabled
            >
            </input>
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cliente Denominación 
        </label>
        <button 
          onClick={alternarDesplegable}
          className="text-cyan-500 cursor-pointer pl-1.5"
          type="button"
          >
          [ Cliente + ]
        </button>
        <div className="flex gap-2">
          <input
            {...register("cliente_denominacion", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* cliente */}
      {/* <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Documento
          </label>
          <select
              {...register("tipoDocumento", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>DNI</option>
              <option value={4}>CARNET DE EXTRANJERÍA</option>
              <option value={6}>RUC</option>
              <option value={7}>PASAPORTE</option>
            </select>
          {errors.operacion && (
            <span className="text-xs text-red-500">Campo obligatorio</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Número de documento del Cliente
          </label>
          <input
            type="type"
            {...register("numeroDocumento", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
 */}
      {/* Observaciones */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="2"
          placeholder="Agregar observaciones..."
        />
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-3 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de emisión</label>
            <input
              type="date"
              {...register("fechaDeEmision", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moneda</label>
            <select
              {...register("moneda")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Soles</option>
              <option value={2}>Dólares</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Venc.</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Columna 3 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de cambio</label>
            <input
              type="text"
              {...register("tipoCambio")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condición de pago</label>
            <select
              {...register("condicionPago")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Contado</option>
              <option>Crédito</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Guardar Comprobante
        </button>
      </div>
    </form>
    <DetalleVenta/>
    </>
  );
};

export default NuevoComprobanteSeccion;