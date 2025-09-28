import { useNavigate } from 'react-router-dom';
export const ResumenVenta = ({ subtotal, impuesto, total }) => {
  const navigate = useNavigate();
  return (
  <>
    <div className="border-t pt-4 mb-4">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span className="font-semibold dark:text-gray-200">S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">IGV (18%)</span>
        <span className="font-semibold dark:text-gray-200">S/ {impuesto.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t">
        <span className="text-gray-800 dark:text-gray-300">Total</span>
        <span className="text-gray-800 dark:text-gray-300">S/ {total.toFixed(2)}</span>
      </div>
    </div>
    <button 
      onClick={() => navigate('/admin-provisional/nuevo-comprobante')}
      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold cursor-pointer">
      Generar Venta - S/ {total.toFixed(2)}
    </button>
  </>
  )
};

