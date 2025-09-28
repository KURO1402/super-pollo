import { useForm } from "react-hook-form";
import { DetalleVenta } from "../componentes/DetalleVenta";

const NuevoComprobanteSeccion = () => {

  // para la fecha actual
  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toISOString().split("T")[0]; // formatear fecha

  // inicializamos react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoOperacion: "Venta interna",
      tipoComprobante: "BOLETA DE VENTA ELECTRÓNICA",
      cliente: "",
      observaciones: "",
      serie: "B001",
      fechaEmision: fechaFormateada,
      almacen: "Almacén - Principal",
      moneda: "Soles",
      fechaVencimiento: fechaFormateada,
      placa: "",
      tipoCambio: "",
      condicionPago: "Contado",
      ordenCompra: "",
    },
  });

  // función submit
  const onSubmit = (data) => {
    console.log("Datos del comprobante:", data);
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
            Tipo Operación
          </label>
          <select
            {...register("tipoOperacion", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Venta interna</option>
          </select>
          {errors.tipoOperacion && (
            <span className="text-xs text-red-500">Campo obligatorio</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Comprobante
          </label>
          <select
            {...register("tipoComprobante", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>BOLETA DE VENTA ELECTRÓNICA</option>
            <option>FACTURA ELECTRÓNICA</option>
          </select>
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cliente
        </label>
        <div className="flex gap-2">
          <input
            {...register("cliente", { required: true })}
            placeholder="Numero de Documento del Cliente"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          </input>
        </div>
      </div>

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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serie</label>
            <select
              {...register("serie")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>B001</option>
              <option>F001</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de emisión</label>
            <input
              type="date"
              {...register("fechaEmision", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Almacén</label>
            <select
              {...register("almacen")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Almacén - Principal</option>
              <option>Almacén - Secundario</option>
            </select>
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
              <option>Soles</option>
              <option>Dólares</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Venc.</label>
            <input
              type="date"
              {...register("fechaVencimiento")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de placa</label>
            <input
              type="text"
              {...register("placa")}
              placeholder="Número de placa"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orden de compra</label>
            <input
              type="text"
              {...register("ordenCompra")}
              placeholder="Orden de compra"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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



