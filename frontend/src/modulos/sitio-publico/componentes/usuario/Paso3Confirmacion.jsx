import { FiFileText, FiDollarSign, FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";
import MercadoPagoButton from "./MercadoPagoButton";
import { useState } from "react";
import { registrarReservacionServicio, generarPreferenciaMercadoPago } from "../../servicios/reservacionesServicio";
import { useAutenticacionGlobal } from "../../../../app/estado-global/autenticacionGlobal";

const Paso3Confirmacion = () => {
  const { datos, getSubtotal, getAnticipo, getTotal, resetReserva } = reservaEstadoGlobal();
  const { usuario } = useAutenticacionGlobal();
  const [ procesandoPago, setProcesandoPago ] = useState(false);
  const [ preferenceId, setPreferenceId ] = useState(null);
  const [ reservationId, setReservationId] = useState(null);

  const subtotal = getSubtotal();
  const anticipo = getAnticipo();
  const total = getTotal();

  // funcion para preparar la reserva y generar la preferencia
  const prepararReservaYPreferencia = async () => {
    if (preferenceId) return preferenceId; // Si ya existe, no generar otra

    setProcesandoPago(true);
    try {
      // Primero registrar la reservación
      const reservaData = {
        fechaReservacion: datos.fecha,
        horaReservacion: datos.hora + ':00',
        cantidadPersonas: datos.personas,
        idUsuario: usuario.idUsuario,
        idMesa: obtenerIdMesa(datos.mesa),
        detalles: datos.productos.map(producto => ({
          cantidadProductoReservacion: producto.cantidad,
          precioUnitario: producto.precio,
          idProducto: producto.idProducto
        }))
      };

      console.log("Enviando datos de reserva:", reservaData);
      
      const reservaCreada = await registrarReservacionServicio(reservaData);
      console.log("Reserva creada:", reservaCreada);
      
      setReservationId(reservaCreada.id);

      // Generar la preferencia de pago
      const preferencia = await generarPreferenciaMercadoPago(reservaCreada.id);
      console.log("Preferencia recibida:", preferencia);
      
      setPreferenceId(preferencia.id);
      return preferencia.id;

    } catch (error) {
      console.error("Error al preparar reserva:", error);
      alert("Error al preparar la reserva. Intenta nuevamente.");
      throw error;
    } finally {
      setProcesandoPago(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setProcesandoPago(true);
    try {
      console.log("Pago exitoso:", paymentData);

      // se deberia crear un end point para confirmar al backend 
      
      resetReserva();
      alert("¡Reserva confirmada exitosamente! Recibirás un correo de confirmación.");
      
    } catch (error) {
      console.error("Error al guardar reserva:", error);
      alert("Error al guardar la reserva. Contacta con soporte.");
    } finally {
      setProcesandoPago(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Error en el pago:", error);
    alert("Error en el proceso de pago. Intenta nuevamente.");
  };

  // extraer id de la mesa
  const obtenerIdMesa = (mesaTexto) => {
    const match = mesaTexto?.match(/Mesa (\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  // Formatear fecha para mejor visualización
  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Formatear moneda
  const formatearMoneda = (monto) => {
    return `S/ ${monto.toFixed(2)}`;
  };

  const handleIniciarPago = async () => {
    try {
      await prepararReservaYPreferencia();

    } catch (error) {
      console.error("Error al iniciar pago:", error);
    }
  };

  const handleCancelarReserva = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta reservación? Se perderán todos los datos.")) {
      resetReserva();
    }
  };

  // Verificar si puede procesar el pago
  const puedeProcesarPago = datos.productos.length > 0 && datos.mesa && !procesandoPago;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Confirmar Reservación
        </h2>
        <p className="text-gray-400">
          Revisa los detalles y realiza el pago del anticipo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen de la Reserva */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-white">Resumen de Reserva</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Fecha:</span>
                <p className="font-semibold text-white">{formatearFecha(datos.fecha)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Hora:</span>
                <p className="font-semibold text-white">{datos.hora || "No especificada"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiUsers className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Personas:</span>
                <p className="font-semibold text-white">{datos.personas} {datos.personas === 1 ? 'persona' : 'personas'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
              <FiMapPin className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Mesa:</span>
                <p className="font-semibold text-white">{datos.mesa || "No seleccionada"}</p>
              </div>
            </div>
          </div>

          {/* Productos Seleccionados */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUtensils className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-white">Productos Seleccionados</h4>
            </div>
            
            {datos.productos.length === 0 ? (
              <div className="text-center py-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400">No hay productos seleccionados</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {datos.productos.map(producto => (
                  <div 
                    key={producto.idProducto} 
                    className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">
                        {producto.cantidad}x {producto.nombre}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {producto.categoria} • S/ {producto.precio} c/u
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500 text-sm">
                        {formatearMoneda(producto.precio * producto.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información de Pago */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-white">Pago del Anticipo</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-blue-600/5 rounded-xl border border-blue-500/20">
              <span className="text-gray-400">Subtotal:</span>
              <span className="font-bold text-white">{formatearMoneda(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-yellow-600/10 rounded-xl border border-yellow-500/20">
              <div>
                <span className="text-gray-400">Anticipo</span>
                <p className="text-xs text-gray-500">(60% del total)</p>
              </div>
              <span className="font-bold text-yellow-500">{formatearMoneda(anticipo)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-600/10 rounded-xl border-2 border-red-500">
              <span className="text-white font-bold text-lg">Total a Pagar:</span>
              <span className="font-bold text-red-500 text-xl">{formatearMoneda(anticipo)}</span>
            </div>

            <div className="text-center p-3 bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-400">
                Saldo pendiente: <span className="text-white font-semibold">{formatearMoneda(total - anticipo)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Se pagará en el restaurante)
              </p>
            </div>
          </div>

          {!preferenceId ? (
            <button 
              onClick={handleIniciarPago}
              disabled={!puedeProcesarPago || procesandoPago}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {procesandoPago ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Preparando pago...
                </>
              ) : (
                "Preparar Pago"
              )}
            </button>
          ) : (
            <div className="mb-4">
              <MercadoPagoButton 
                monto={anticipo}
                datosReserva={datos}
                preferenceId={preferenceId}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                disabled={!puedeProcesarPago}
              />
            </div>
          )}

          {procesandoPago && (
            <div className="text-center py-2">
              <p className="text-blue-500 text-sm">Procesando reserva...</p>
            </div>
          )}

          <button 
            onClick={handleCancelarReserva}
            disabled={procesandoPago}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {procesandoPago ? "Procesando..." : "Cancelar Reservación"}
          </button>

          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              <strong>Importante:</strong> Al pagar el anticipo, confirmas tu reservación. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paso3Confirmacion;