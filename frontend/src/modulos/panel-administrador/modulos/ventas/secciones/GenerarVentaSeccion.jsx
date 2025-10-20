// librerías externas
import { FiShoppingCart, FiUser, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
// hooks de react
import { useState } from "react";
// servicios
import { registrarVenta } from "../servicios/ventasServicio";
// Estado global o manejo de contexto
import { useVentaEstadoGlobal } from "../estado-global/useVentaEstadoGlobal";
// componentes reutilizables
import Modal from "../../../componentes/modal/Modal";
import { ModalConfirmacion } from "../../../componentes/modal/ModalConfirmacion";
import { BarraBusqueda } from "../../../componentes/busqueda-filtros/BarraBusqueda";
import mostrarAlerta from "../../../../../utilidades/toastUtilidades";
// custom hooks
import { useModal } from "../../../hooks/useModal";
import { useConfirmacion } from "../../../hooks/useConfirmacion";
import { useBusqueda } from "../../../hooks/useBusqueda";
// componentes de la seccion
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { DetalleVenta } from "../componentes/DetalleVenta";
import { ResumenVenta } from "../componentes/ResumenVenta";
import { FormularioCliente } from "../componentes/FormularioCliente";
// data temporal
import { productos } from "../data-temporal/productos";
import { metodoPagoDatos } from "../data-temporal/metodoPago";

const SeccionVentas = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { detalle, subtotal, impuesto, total, limpiarVenta } = useVentaEstadoGlobal();
  const { estaAbierto, abrir, cerrar } = useModal();
   const { confirmacionVisible, mensajeConfirmacion, tituloConfirmacion, solicitarConfirmacion, ocultarConfirmacion, confirmarAccion} = useConfirmacion();
  // guardar los datos en estados locales
  const [tipoComprobante, setTipoComprobante] = useState(2);
  const [tipoPago, setTipoPago] = useState("contado");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [observaciones, setObservaciones] = useState("");
  const [datosCliente, setDatosCliente] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [urlPDF, setUrlPDF] = useState(null);

  const handleTipoComprobante = (tipo) => {
    setTipoComprobante(tipo);
    // Si cambia a boleta, limpiar datos del cliente (ahora es opcional)
    // Si prefieres mantener el cliente al cambiar a boleta, comenta esta línea
    if (tipo === 2 && datosCliente) {
      setDatosCliente(null);
    }
  };
  // Abrir modal para agregar/editar cliente
  const handleAbrirModalCliente = () => {
    abrir();
  };
  // Cerrar modal del cliente
  const handleCerrarModalCliente = () => {
    cerrar();
  };
  // guardar datos del cliente desde el formulario
  const handleClienteGuardado = (cliente) => {
    mostrarAlerta.exito("Cliente agregado a la venta");
    setDatosCliente(cliente);
    cerrar();
  };
  // eliminar cleinte de la venta
  const handleEliminarCliente = () => {
    solicitarConfirmacion(
      "¿Desea quitar el cliente de esta venta?",
      () => {
        setDatosCliente(null);
        mostrarAlerta.exito("Cliente quitado de la venta");
      },
      "Quitar cliente"
    );
  };
  // generar el comprobante, aqui se llama al servicio
  const handleGenerarComprobante = async () => {
    // Validaciones
    if (detalle.length === 0) {
      mostrarAlerta.advertencia("Debe agregar al menos un producto")
      return;
    }

    // Solo obligatorio para factura
    if (tipoComprobante === 1 && !datosCliente) {
      mostrarAlerta.advertencia("Debe agregar un cliente para emitir factura")
      return;
    }

    setCargando(true);

    try {
      // Mapear productos
      const productosVenta = detalle.map((item) => ({
        idProducto: item.id,
        cantidad: item.cantidad,
      }));

      // Armar objeto de venta
      const venta = {
        tipoComprobante: Number(tipoComprobante),
        productos: productosVenta,
      };

      // Si hay datos del cliente (obligatorio para factura, opcional para boleta)
      if (datosCliente) {
        venta.datosCliente = {
          tipoDoc: Number(datosCliente.tipoDocumento),
          numeroDoc: datosCliente.numeroDocumento,
          nombreCliente: datosCliente.nombre,
        };
      }
      // mostramos los datos que se envian al backend
      console.log("Datos enviados al backend:", venta);
      // llamar al servicio para registrar la venta
      const ventaRegistrada = await registrarVenta(venta);
      // mostrar resultado
      if (ventaRegistrada) {
        console.log("Venta registrada:", ventaRegistrada);
        
        // Guardar URL del PDF
        if (ventaRegistrada.enlace_del_pdf) {
          setUrlPDF(ventaRegistrada.enlace_del_pdf);
          setMostrarPDF(true);
          mostrarAlerta.exito("Comprobante generado");
        } else {
          mostrarAlerta.error("No se ha podido realizar la venta con éxito");
        }
        // Limpiar todo
        limpiarVenta();
        setObservaciones("");
        setDatosCliente(null);
      }
    } catch (error) {
      console.error("Error al generar comprobante:", error);
      mostrarAlerta.error("Error al generar el comprobante");
    } finally {
      setCargando(false);
    }
  };
  // limpiar toda la venta
  const handleLimpiarVenta = () => {
    if (detalle.length > 0 || datosCliente) {
      solicitarConfirmacion(
        "¿Estás seguro de limpiar toda la venta?",
        () => {
          limpiarVenta();
          setObservaciones("");
          setDatosCliente(null);
          mostrarAlerta.exito("Venta limpiada correctamente");
        },
        "Limpiar venta"
      );
    }
  };
  // cerrar modal de pdf
  const handleCerrarModalPDF = () => {
    setMostrarPDF(false);
    setUrlPDF(null);
  };
  // descargar o imprimir el pdf del comprobante
  const handleDescargarPDF = () => {
    if (urlPDF) {
      window.open(urlPDF, '_blank');
    }
  };
  // filtrar productos por busqueda
  let filtrados = filtrarPorBusqueda(productos, ["nombre"]);

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Punto de Venta
        </h1>
        <FiShoppingCart className="text-2xl text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel Izquierdo - Productos */}
        <div className="lg:col-span-1">
          <div className="mb-3">
            <BarraBusqueda
              valor={terminoBusqueda}
              onChange={setTerminoBusqueda}
              placeholder="Buscar por producto..."
            />
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto">
            {filtrados.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 border-b border-gray-200 dark:border-gray-700 pb-4 lg:pb-0">
            <div className="flex w-full lg:w-auto">
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  tipoComprobante === 2
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTipoComprobante(2)}
              >
                Boleta
              </button>
              <button
                className={`flex-1 lg:flex-none px-4 lg:px-8 py-3 font-medium cursor-pointer border-b-2 lg:border-b-3 transition-colors duration-200 text-sm lg:text-base ${
                  tipoComprobante === 1
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTipoComprobante(1)}
              >
                Factura
              </button>
            </div>
            <div className="w-full lg:w-auto lg:ml-auto">
              <input
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-48 xl:w-56"
                value={tipoComprobante === 2 ? "B001" : "F001"}
                disabled
              />
            </div>
          </div>
          <div className="py-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cliente 
              {tipoComprobante === 1 && <span className="text-red-500"> *</span>}
              {tipoComprobante === 2 && <span className="text-gray-500 text-xs ml-1">(Opcional)</span>}
            </label>

            {datosCliente ? (
              // Cliente guardado para boleta o factura
              <div className="flex items-center gap-2 p-3 border border-green-300 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/20">
                <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {datosCliente.nombre}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Doc: {datosCliente.numeroDocumento}
                  </p>
                </div>
                <button
                  onClick={handleAbrirModalCliente}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                  title="Editar cliente"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={handleEliminarCliente}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Quitar cliente"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              // Sin cliente
              <div className="flex gap-2 w-full">
                <div className="flex-grow flex items-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <FiUser className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-500 text-sm">
                    {tipoComprobante === 2 ? "Clientes Varios" : "Sin cliente asignado"}
                  </span>
                </div>
                <button
                  onClick={handleAbrirModalCliente}
                  className="w-20 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  title={tipoComprobante === 2 ? "Agregar cliente (opcional)" : "Agregar cliente (obligatorio)"}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
          <div className="py-2">
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Pago
                </label>
                <select
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors duration-200"
                >
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-colors duration-200"
                >
                  {metodoPagoDatos.map((metodo) => (
                    <option key={metodo.id} value={metodo.nombre.toLowerCase()}>{metodo.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full duration-200"
                  placeholder="Observaciones..."
                />
              </div>
            </div>
          </div>

          <DetalleVenta />

          <ResumenVenta subtotal={subtotal()} impuesto={impuesto()} total={total()} />

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLimpiarVenta}
              disabled={detalle.length === 0 && !datosCliente}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
            >
              Limpiar Todo
            </button>
            <button
              onClick={handleGenerarComprobante}
              disabled={detalle.length === 0 || cargando || (tipoComprobante === 1 && !datosCliente)}
              className="flex-1 sm:flex-[2] px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </>
              ) : (
                "Generar e Imprimir Comprobante"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Cliente */}
      {estaAbierto && (
        <Modal
          estaAbierto={estaAbierto}
          onCerrar={cerrar}
          titulo={datosCliente ? "Editar Cliente" : "Agregar Cliente"}
          tamaño="xl"
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <FormularioCliente
            onSubmit={handleClienteGuardado}
            onCancelar={cerrar}
          />
        </Modal>
      )}

      {/* modal de pdf generado */}
      {mostrarPDF && urlPDF && (
        <Modal
          estaAbierto={mostrarPDF}
          onCerrar={handleCerrarModalPDF}
          titulo="Comprobante Generado"
          tamaño="2xl"
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCheck className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  ¡Comprobante generado exitosamente!
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                El comprobante ha sido registrado en SUNAT y está listo para descargar o imprimir.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDescargarPDF}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar / Imprimir PDF
              </button>
              <button
                onClick={handleCerrarModalPDF}
                className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <iframe
                src={urlPDF}
                className="w-full h-[500px] rounded-lg border border-gray-300 dark:border-gray-600"
                title="Vista previa del comprobante"
              />
            </div>
          </div>
        </Modal>
      )}
      {/* Modal de confirmación */}
      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar="Sí, quitar"
        textoCancelar="Cancelar"
        tipo="peligro"
      />
    </div>
  );
};

export default SeccionVentas;