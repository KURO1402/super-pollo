import { useForm } from "react-hook-form";
import { useModal } from "../../hooks/useModal";
import Modal from "../../componentes/modal/Modal";
import { FormularioCliente } from "./FormularioCliente";
import { useState } from "react";

export const FormularioComprobante = ({ alEnviar, onClienteAgregado  }) => {
  const { estaAbierto, abrir, cerrar } = useModal();
  const [clienteCompleto, setClienteCompleto] = useState(null)

  const hoy = new Date();
  const fechaFormateada = hoy.toISOString().split("T")[0]; // formatear fecha

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoComprobante: 2,
      serie: "B001",
      clienteDenominacion: "Cliente Varios",
      observaciones: "",
      fechaDeEmision: fechaFormateada,
      fechaDeVencimiento: fechaFormateada,
      moneda: 1,
      tipoCambio: "",
      tipoOperacion: 1,
      condicionPago: 1,
    },
  });

  const manejarEnvioFormulario = async (datos) => {
  try {
    // Crear objeto con datos del formulario + cliente completo si existe
    const datosParaEnviar = {
      ...datos,
      ...(clienteCompleto && { datosCliente: clienteCompleto }) // ← INCLUIR CLIENTE SI EXISTE
    };
    
    console.log("Datos del formulario:", datosParaEnviar);
    await alEnviar(datosParaEnviar); 
    reset(); 
    setClienteCompleto(null); // Limpiar cliente después del envío
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
};

  const tipo = watch("tipoComprobante");

  const manejarAbrirModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    abrir();
  };

  const manejarGuardarCliente = (datosCliente) => {
    console.log("Cliente guardado:", datosCliente);
    // Actualizar formulario
    setValue("clienteDenominacion", datosCliente.nombre);
    // guardamos el cliente conpleto en el estado
    setClienteCompleto(datosCliente);
    // Pasar el cliente al componente padre
    if (onClienteAgregado) {
      onClienteAgregado(datosCliente);
    }
    
    cerrar();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(manejarEnvioFormulario)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Serie
            </label>
            <input
              {...register("serie", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={tipo == 2 ? "B001" : "F001"}
              disabled
            />
          </div>
        </div>

        {/* Cliente */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cliente Denominación
          </label>
          <button
            onClick={manejarAbrirModal}
            className="text-cyan-500 cursor-pointer pl-1.5"
            type="button"
          >
            [ Cliente + ]
          </button>
          <div className="flex gap-2">
            <input
              {...register("clienteDenominacion", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de emisión
              </label>
              <input
                type="date"
                {...register("fechaDeEmision", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                {...register("fechaDeVencimiento")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>


          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Moneda
              </label>
              <select
                {...register("moneda")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Soles</option>
                <option value={2}>Dólares</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Cambio
              </label>
              <input
                {...register("tipoCambio")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Columna 3 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Operacion
              </label>
              <select
                {...register("tipoOperacion")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Venta Interna</option>
                <option value={2}>Venta Externa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condición de pago
              </label>
              <select
                {...register("condicionPago")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Contado</option>
                <option value={2}>Crédito</option>
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
      {estaAbierto && (
        <Modal
          estaAbierto={estaAbierto}
          onCerrar={cerrar}
          titulo="Nuevo Cliente"
          tamaño={"xl"}
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <FormularioCliente 
           onSubmit={manejarGuardarCliente}
            onCancelar={cerrar}
          />
        </Modal>
      )}
    </>
  );
};
