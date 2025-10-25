import { FiShoppingCart, FiTrash, FiPlus, FiMinus } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";

const Paso2Productos = () => {
  const { 
    productosMenu, 
    datos, 
    agregarProducto, 
    quitarProducto, 
    actualizarCantidad,
    getSubtotal,
    getTotal 
  } = reservaEstadoGlobal();

  const subtotal = getSubtotal();
  const total = getTotal();

  // Agrupar productos por categoría para mejor organización
  const productosPorCategoria = productosMenu.reduce((acc, producto) => {
    if (!acc[producto.categoria]) {
      acc[producto.categoria] = [];
    }
    acc[producto.categoria].push(producto);
    return acc;
  }, {});

  // Verificar si un producto ya está en el carrito
  const productoEnCarrito = (productoId) => {
    return datos.productos.some(p => p.id === productoId);
  };

  // Obtener cantidad de un producto en el carrito
  const getCantidadEnCarrito = (productoId) => {
    const producto = datos.productos.find(p => p.id === productoId);
    return producto ? producto.cantidad : 0;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Selecciona tus Productos
        </h2>
        <p className="text-gray-400">
          Elige los platos y bebidas para tu reserva
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Menú de Productos */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
              <FaUtensils className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-white">Nuestro Menú</h3>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
              <div key={categoria} className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">
                  {categoria}
                </h4>
                {productos.map(producto => {
                  const enCarrito = productoEnCarrito(producto.id);
                  const cantidad = getCantidadEnCarrito(producto.id);
                  
                  return (
                    <div 
                      key={producto.id} 
                      className={`flex justify-between items-center p-4 border rounded-xl transition-all ${
                        enCarrito 
                          ? "border-green-500 bg-green-500/5" 
                          : "border-gray-600 hover:border-blue-500 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{producto.nombre}</h4>
                        <p className="text-sm text-gray-400">{producto.categoria}</p>
                        <p className="text-lg font-bold text-red-600 mt-1">S/ {producto.precio}</p>
                        {enCarrito && (
                          <p className="text-sm text-green-500 mt-1">
                            ✓ En carrito: {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => agregarProducto(producto)}
                        disabled={enCarrito && cantidad >= 10} // Límite de 10 por producto
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          enCarrito && cantidad >= 10
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : enCarrito
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {enCarrito && cantidad >= 10 ? "Límite" : "Agregar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Carrito de Productos */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center">
              <FiShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Tu Pedido</h3>
              <p className="text-sm text-gray-400">
                {datos.productos.length} {datos.productos.length === 1 ? 'producto' : 'productos'} seleccionados
              </p>
            </div>
          </div>

          {datos.productos.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm">
                Agrega productos del menú para continuar
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {datos.productos.map(producto => (
                  <div 
                    key={producto.id} 
                    className="flex justify-between items-center p-4 border border-gray-600 rounded-xl bg-gray-700/30"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm leading-tight">
                        {producto.nombre}
                      </h4>
                      <p className="text-red-600 font-bold text-sm">
                        S/ {producto.precio} c/u
                      </p>
                      <p className="text-green-500 text-xs">
                        Total: S/ {(producto.precio * producto.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-600 rounded-lg p-1">
                        <button
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                          disabled={producto.cantidad <= 1}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            producto.cantidad <= 1
                              ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                              : "bg-gray-500 hover:bg-gray-400 text-white"
                          }`}
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold w-6 text-center text-white text-sm">
                          {producto.cantidad}
                        </span>
                        <button
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                          disabled={producto.cantidad >= 10}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            producto.cantidad >= 10
                              ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                              : "bg-gray-500 hover:bg-gray-400 text-white"
                          }`}
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => quitarProducto(producto.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <FiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen del Pedido */}
              <div className="mt-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-600">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-bold text-white">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total a pagar:</span>
                  <span className="text-red-600 text-xl">S/ {total.toFixed(2)}</span>
                </div>
                <div className="mt-3 text-xs text-gray-400 text-center">
                  El anticipo del 60% se calculará en el siguiente paso
                </div>
              </div>

              {/* Indicador de progreso */}
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-500 text-sm text-center">
                  Listo para continuar - {datos.productos.length} {datos.productos.length === 1 ? 'producto' : 'productos'} seleccionados
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paso2Productos;