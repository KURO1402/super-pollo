import { FaSave, FaPrint } from 'react-icons/fa';
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
    <div className="py-2">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button className="w-full sm:w-1/2 cursor-pointer bg-transparent dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-3 py-4 font-semibold border border-gray-600 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105">
          <FaSave className="text-xl text-cyan-400" />
          Guardar
        </button>
        <button className="w-full sm:w-1/2 cursor-pointer bg-gray-100 dark:bg-gray-800 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-3 py-4 font-semibold border border-gray-600 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105">
          <FaPrint className="text-xl text-red-400" />
          Guardar e Imprimir
        </button>
      </div>
    </div>
  </>
  )
};

