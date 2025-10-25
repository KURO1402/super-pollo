import { useState } from "react";
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiMapPin,
  FiShoppingCart,
  FiFileText,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiDollarSign
} from "react-icons/fi";
import { FaUtensils, FaRegCreditCard } from "react-icons/fa";

const NuevaReservacion = () => {
  const [pasoActual, setPasoActual] = useState(1);
  const [reservaData, setReservaData] = useState({
    // Paso 1: Datos básicos
    fecha: "",
    hora: "",
    personas: 2,
    mesa: "",
    
    // Paso 2: Productos
    productos: [],
    
    // Paso 3: Confirmación
    subtotal: 0,
    anticipo: 0,
    total: 0
  });

  // Datos de ejemplo
  const mesasDisponibles = [
    { id: 1, numero: "Mesa 1", capacidad: 4, ubicacion: "Terraza" },
    { id: 2, numero: "Mesa 2", capacidad: 2, ubicacion: "Interior" },
    { id: 3, numero: "Mesa 3", capacidad: 6, ubicacion: "Jardín" },
    { id: 4, numero: "Mesa 4", capacidad: 4, ubicacion: "Interior" },
    { id: 5, numero: "Mesa 5", capacidad: 8, ubicacion: "Sala Privada" }
  ];

  const productosMenu = [
    { id: 1, nombre: "Pollo a la Brasa Familiar", precio: 45, categoria: "Platos Principales" },
    { id: 2, nombre: "Pollo a la Brasa Mediano", precio: 30, categoria: "Platos Principales" },
    { id: 3, nombre: "Papas Fritas Familiar", precio: 12, categoria: "Acompañamientos" },
    { id: 4, nombre: "Ensalada César", precio: 8, categoria: "Ensaladas" },
    { id: 5, nombre: "Gaseosa 1L", precio: 5, categoria: "Bebidas" },
    { id: 6, nombre: "Cerveza Artesanal", precio: 8, categoria: "Bebidas" },
    { id: 7, nombre: "Postre de Lucuma", precio: 6, categoria: "Postres" }
  ];

  // Funciones para manejar los datos
  const agregarProducto = (producto) => {
    const existe = reservaData.productos.find(p => p.id === producto.id);
    if (existe) {
      setReservaData(prev => ({
        ...prev,
        productos: prev.productos.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      }));
    } else {
      setReservaData(prev => ({
        ...prev,
        productos: [...prev.productos, { ...producto, cantidad: 1 }]
      }));
    }
  };

  const quitarProducto = (productoId) => {
    setReservaData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== productoId)
    }));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad === 0) {
      quitarProducto(productoId);
    } else {
      setReservaData(prev => ({
        ...prev,
        productos: prev.productos.map(p =>
          p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
        )
      }));
    }
  };

  // Calcular totales
  const subtotal = reservaData.productos.reduce((total, producto) => 
    total + (producto.precio * producto.cantidad), 0
  );
  const anticipo = subtotal * 0.6; // 60% de anticipo
  const total = subtotal;

  // Componente del Paso 1: Datos Básicos
  const Paso1DatosBasicos = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Datos de la Reservación
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Selecciona la fecha, hora y mesa para tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Fecha y Hora */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-azul-primario/10 rounded-xl flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-azul-primario" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fecha y Hora</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={reservaData.fecha}
                  onChange={(e) => setReservaData(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hora
                </label>
                <select
                  value={reservaData.hora}
                  onChange={(e) => setReservaData(prev => ({ ...prev, hora: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                >
                  <option value="">Seleccionar hora</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Personas
                </label>
                <select
                  value={reservaData.personas}
                  onChange={(e) => setReservaData(prev => ({ ...prev, personas: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Selección de Mesa */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-rojo/10 rounded-xl flex items-center justify-center">
              <FiMapPin className="w-6 h-6 text-rojo" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Seleccionar Mesa</h3>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mesasDisponibles
              .filter(mesa => mesa.capacidad >= reservaData.personas)
              .map(mesa => (
                <div
                  key={mesa.id}
                  onClick={() => setReservaData(prev => ({ ...prev, mesa: mesa.numero }))}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    reservaData.mesa === mesa.numero
                      ? "border-rojo bg-rojo/5"
                      : "border-gray-200 dark:border-gray-600 hover:border-azul-primario"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{mesa.numero}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{mesa.ubicacion}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FiUsers className="w-4 h-4" />
                        <span>Hasta {mesa.capacidad} personas</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        reservaData.mesa === mesa.numero ? "text-rojo" : "text-green-600"
                      }`}>
                        {reservaData.mesa === mesa.numero ? "Seleccionada" : "Disponible"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Componente del Paso 2: Selección de Productos
  const Paso2Productos = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Selecciona tus Productos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Elige los platos y bebidas para tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menú de Productos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amarillo/20 rounded-xl flex items-center justify-center">
              <FaUtensils className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Nuestro Menú</h3>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {productosMenu.map(producto => (
              <div key={producto.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{producto.nombre}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{producto.categoria}</p>
                  <p className="text-lg font-bold text-rojo mt-1">S/ {producto.precio}</p>
                </div>
                <button
                  onClick={() => agregarProducto(producto)}
                  className="bg-rojo hover:bg-rojo/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito de Productos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FiShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tu Pedido</h3>
          </div>

          {reservaData.productos.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No hay productos agregados</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reservaData.productos.map(producto => (
                <div key={producto.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{producto.nombre}</h4>
                    <p className="text-rojo font-bold">S/ {producto.precio} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{producto.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => quitarProducto(producto.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resumen del Pedido */}
          {reservaData.productos.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-bold text-gray-900 dark:text-white">S/ {subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-rojo">S/ {total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Componente del Paso 3: Confirmación y Pago
  const Paso3Confirmacion = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Confirmar Reservación
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Revisa los detalles y realiza el pago del anticipo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen de la Reserva */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-azul-primario/10 rounded-xl flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-azul-primario" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Resumen de Reserva</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
              <span className="font-semibold">{reservaData.fecha}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Hora:</span>
              <span className="font-semibold">{reservaData.hora}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Personas:</span>
              <span className="font-semibold">{reservaData.personas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Mesa:</span>
              <span className="font-semibold">{reservaData.mesa}</span>
            </div>
          </div>

          {/* Productos Seleccionados */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Productos:</h4>
            <div className="space-y-2">
              {reservaData.productos.map(producto => (
                <div key={producto.id} className="flex justify-between text-sm">
                  <span>{producto.cantidad}x {producto.nombre}</span>
                  <span>S/ {producto.precio * producto.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información de Pago */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Pago del Anticipo</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-azul-primario/5 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-bold">S/ {subtotal}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amarillo/10 rounded-xl">
              <span className="text-gray-600 dark:text-gray-400">Anticipo (60%):</span>
              <span className="font-bold text-rojo">S/ {anticipo}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-rojo">
              <span className="text-gray-900 dark:text-white font-bold">Total a Pagar:</span>
              <span className="font-bold text-rojo text-xl">S/ {anticipo}</span>
            </div>
          </div>

          {/* Botón de Mercado Pago */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 mb-4">
            <FaRegCreditCard className="w-6 h-6" />
            Pagar con Mercado Pago
          </button>

          <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors">
            Cancelar Reservación
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            Al pagar el anticipo, confirmas tu reservación. El saldo restante se pagará en el restaurante.
          </p>
        </div>
      </div>
    </div>
  );

  // Validaciones para avanzar entre pasos
  const puedeAvanzarPaso1 = reservaData.fecha && reservaData.hora && reservaData.mesa;
  const puedeAvanzarPaso2 = reservaData.productos.length > 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-azul-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            NUEVA <span className="text-rojo">RESERVACIÓN</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
        </div>

        {/* Indicador de Pasos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map(paso => (
              <div key={paso} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                  paso === pasoActual
                    ? "bg-rojo border-rojo text-white"
                    : paso < pasoActual
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                }`}>
                  {paso < pasoActual ? <FiCheck className="w-6 h-6" /> : paso}
                </div>
                {paso < 3 && (
                  <div className={`w-24 h-1 mx-4 ${
                    paso < pasoActual ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-medium">
            <span className={pasoActual >= 1 ? "text-rojo" : "text-gray-500"}>Datos Básicos</span>
            <span className={pasoActual >= 2 ? "text-rojo" : "text-gray-500"}>Productos</span>
            <span className={pasoActual >= 3 ? "text-rojo" : "text-gray-500"}>Confirmación</span>
          </div>
        </div>

        {/* Contenido del Paso Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          {pasoActual === 1 && <Paso1DatosBasicos />}
          {pasoActual === 2 && <Paso2Productos />}
          {pasoActual === 3 && <Paso3Confirmacion />}
        </div>

        {/* Navegación entre Pasos */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setPasoActual(pasoActual - 1)}
            disabled={pasoActual === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              pasoActual === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white hover:scale-105"
            }`}
          >
            <FiArrowLeft className="w-5 h-5" />
            Anterior
          </button>

          <button
            onClick={() => {
              if (pasoActual === 1 && puedeAvanzarPaso1) setPasoActual(2);
              else if (pasoActual === 2 && puedeAvanzarPaso2) setPasoActual(3);
            }}
            disabled={
              (pasoActual === 1 && !puedeAvanzarPaso1) ||
              (pasoActual === 2 && !puedeAvanzarPaso2)
            }
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              (pasoActual === 1 && !puedeAvanzarPaso1) || (pasoActual === 2 && !puedeAvanzarPaso2)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-rojo hover:bg-rojo/90 text-white hover:scale-105"
            }`}
          >
            {pasoActual === 3 ? "Confirmar Reservación" : "Siguiente"}
            {pasoActual < 3 && <FiArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NuevaReservacion;