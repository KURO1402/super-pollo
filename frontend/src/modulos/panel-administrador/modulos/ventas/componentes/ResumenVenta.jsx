export const ResumenVenta = ({ subtotal, impuesto, total }) => {
  return (
  <>
    <div className="pt-4 mb-4">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="font-semibold dark:text-gray-200">S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">IGV (18%)</span>
        <span className="font-semibold dark:text-gray-200">S/ {impuesto.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-400">
        <span className="text-gray-800 dark:text-gray-300">Total</span>
        <span className="text-gray-800 dark:text-gray-300">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  </>
  )
};

