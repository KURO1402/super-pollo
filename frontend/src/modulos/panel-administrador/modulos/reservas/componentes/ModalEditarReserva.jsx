import { FiCalendar, FiClock, FiUsers, FiBox, FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";

export const ModalEditarReserva = ({ reserva, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    fechaReservacion: '',
    horaReservacion: '',
    cantidadPersonas: '',
    numeroMesa: '',
    estadoReservacion: 'pendiente'
  });

  const [productos, setProductos] = useState([]);
  const [mostrarAgregarProducto, setMostrarAgregarProducto] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    cantidad: 1,
    precio: 0
  });

  // Lista de productos disponibles con precios fijos
  const productosDisponibles = [
    { id: 1, nombre: "Pollo a la Brasa", precio: 45.00 },
    { id: 2, nombre: "1/4 Pollo", precio: 25.00 },
    { id: 3, nombre: "1/2 Pollo", precio: 35.00 },
    { id: 4, nombre: "Inca Kola 500ml", precio: 5.00 },
    { id: 5, nombre: "Coca Cola 1L", precio: 8.00 },
    { id: 6, nombre: "Ensalada Mixta", precio: 14.50 },
    { id: 7, nombre: "Papas Fritas", precio: 12.00 }
  ];

  // Precargar datos cuando la reserva cambie
  useEffect(() => {
    if (reserva) {
      setFormData({
        fechaReservacion: reserva.fechaReservacion,
        horaReservacion: reserva.horaReservacion.substring(0, 5),
        cantidadPersonas: reserva.cantidadPersonas.toString(),
        numeroMesa: reserva.numeroMesa.toString(),
        estadoReservacion: reserva.estadoReservacion
      });
      
      // Precargar productos si existen
      if (reserva.productos && reserva.productos.length > 0) {
        setProductos(reserva.productos);
      }
    }
  }, [reserva]);

  // Manejar cambio de producto en el select
  const handleSeleccionarProducto = (e) => {
    const nombreProducto = e.target.value;
    const productoSeleccionado = productosDisponibles.find(p => p.nombre === nombreProducto);
    
    if (productoSeleccionado) {
      setNuevoProducto({
        nombre: productoSeleccionado.nombre,
        cantidad: 1,
        precio: productoSeleccionado.precio // Precio fijo del producto
      });
    } else {
      setNuevoProducto({
        nombre: '',
        cantidad: 1,
        precio: 0
      });
    }
  };

  // Manejo de cambios en el formulario principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejo de cambios en la cantidad del nuevo producto
  const handleChangeCantidad = (e) => {
    const cantidad = parseInt(e.target.value) || 1;
    setNuevoProducto(prev => ({
      ...prev,
      cantidad: cantidad < 1 ? 1 : cantidad
    }));
  };

  // Agregar nuevo producto con precio fijo
  const handleAgregarProducto = () => {
    if (!nuevoProducto.nombre || nuevoProducto.cantidad < 1) {
      alert('Por favor, complete todos los campos del producto');
      return;
    }

    const productoExistente = productos.find(p => p.nombre === nuevoProducto.nombre);
    
    if (productoExistente) {
      // Si el producto ya existe, actualizar cantidad (mantener el precio original)
      setProductos(prev => prev.map(p => 
        p.nombre === nuevoProducto.nombre 
          ? { ...p, cantidad: p.cantidad + nuevoProducto.cantidad }
          : p
      ));
    } else {
      // Agregar nuevo producto con el precio fijo
      setProductos(prev => [...prev, { ...nuevoProducto }]);
    }

    // Resetear formulario
    setNuevoProducto({ nombre: '', cantidad: 1, precio: 0 });
    setMostrarAgregarProducto(false);
  };

  // Eliminar producto
  const handleEliminarProducto = (index) => {
    setProductos(prev => prev.filter((_, i) => i !== index));
  };

  // Actualizar cantidad de producto existente
  const handleActualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setProductos(prev => prev.map((producto, i) => 
      i === index ? { ...producto, cantidad: nuevaCantidad } : producto
    ));
  };

  // Calcular total
  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  // Manejo de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.fechaReservacion || !formData.horaReservacion || !formData.cantidadPersonas || !formData.numeroMesa) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (formData.cantidadPersonas < 1) {
      alert('La cantidad de personas debe ser al menos 1');
      return;
    }

    if (formData.numeroMesa < 1) {
      alert('El número de mesa debe ser válido');
      return;
    }

    // Preparar datos para enviar
    const datosActualizados = {
      ...formData,
      cantidadPersonas: parseInt(formData.cantidadPersonas),
      numeroMesa: parseInt(formData.numeroMesa),
      idReservacion: reserva.idReservacion,
      productos: productos,
      montoTotal: calcularTotal()
    };

    // Llamar a la función de guardar con los datos actualizados
    onGuardar(datosActualizados);
  };

  if (!reserva) return null;

  return (
    <div className="space-y-6">
      {/* Información del cliente */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
          <FiUsers size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
          <p className="text-gray-900 dark:text-white font-medium">{reserva.nombresUsuario}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{reserva.idReservacion}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiCalendar size={16} className="text-blue-600 dark:text-blue-400" />
                Fecha de Reserva
              </div>
            </label>
            <input
              type="date"
              name="fechaReservacion"
              value={formData.fechaReservacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiClock size={16} className="text-blue-600 dark:text-blue-400" />
                Hora de Reserva
              </div>
            </label>
            <input
              type="time"
              name="horaReservacion"
              value={formData.horaReservacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Cantidad de Personas y Mesa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiUsers size={16} className="text-green-600 dark:text-green-400" />
                Cantidad de Personas
              </div>
            </label>
            <input
              type="number"
              name="cantidadPersonas"
              value={formData.cantidadPersonas}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <FiBox size={16} className="text-amber-600 dark:text-amber-400" />
                Número de Mesa
              </div>
            </label>
            <input
              type="number"
              name="numeroMesa"
              value={formData.numeroMesa}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Estado de la Reserva */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado de la Reserva
          </label>
          <select
            name="estadoReservacion"
            value={formData.estadoReservacion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Gestión de Productos */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Productos Reservados
            </h4>
            <button
              type="button"
              onClick={() => setMostrarAgregarProducto(!mostrarAgregarProducto)}
              className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <FiPlus size={14} />
              Agregar Producto
            </button>
          </div>

          {/* Formulario para agregar producto */}
          {mostrarAgregarProducto && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Producto
                  </label>
                  <select
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleSeleccionarProducto}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar producto</option>
                    {productosDisponibles.map(producto => (
                      <option key={producto.id} value={producto.nombre}>
                        {producto.nombre} - S/ {producto.precio.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={nuevoProducto.cantidad}
                    onChange={handleChangeCantidad}
                    min="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Mostrar precio fijo del producto seleccionado */}
              {nuevoProducto.nombre && (
                <div className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded border">
                  <strong>Precio unitario:</strong> S/ {nuevoProducto.precio.toFixed(2)}
                  <br />
                  <strong>Subtotal:</strong> S/ {(nuevoProducto.precio * nuevoProducto.cantidad).toFixed(2)}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAgregarProducto}
                  className="px-3 py-1 text-xs cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Agregar Producto
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarAgregarProducto(false)}
                  className="px-3 py-1 text-xs bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de productos */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {productos.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No hay productos agregados
              </p>
            ) : (
              productos.map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{producto.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      S/ {producto.precio.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleActualizarCantidad(index, producto.cantidad - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-8 text-center text-gray-800 dark:text-gray-200">{producto.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => handleActualizarCantidad(index, producto.cantidad + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                      S/ {(producto.precio * producto.cantidad).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleEliminarProducto(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          {productos.length > 0 && (
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                S/ {calcularTotal().toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors font-medium cursor-pointer"
          >
            <FiX size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex-1 justify-center cursor-pointer"
          >
            <FiSave size={16} />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};