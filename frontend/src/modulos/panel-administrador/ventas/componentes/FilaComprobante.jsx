import { FiFileText, FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";

export const FilaComprobante = ({ comprobante }) => {
  return (
    <tr key={comprobante.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
            { /* si es factura se le da el volor azul, sino verde */ }
          <FiFileText className={`${comprobante.tipo === "factura" ? "text-blue-500" : "text-green-500"}`} />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {comprobante.serie}-{comprobante.correlativo} 
            </div>
            <div className="text-xs text-gray-500 capitalize">{comprobante.tipo}</div>
          </div>
        </div>
      </td>

      {/* cliente */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{comprobante.cliente}</div>
        <div className="text-xs text-gray-500">{comprobante.rucDni}</div>
      </td>

      {/* fechas */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          Emisión: {comprobante.fechaEmision}
        </div>
        <div className="text-xs text-gray-500">
          Vencimiento: {comprobante.fechaVencimiento}
        </div>
      </td>

      {/* total */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          S/ {comprobante.totalVenta.toFixed(2)}
        </div>
      </td>

      {/* estado sunat */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            comprobante.estado === "aceptado"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        > 
          {comprobante.estado === "aceptado" ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
          {comprobante.estado.toUpperCase()}
        </div>
      </td>
      
      {/* Acciones */}
      <td className="px-6 py-4 whitespace-nowrap">
        <button className="flex text-center p-1 pl-6 text-blue-500 hover:text-blue-700" title="Ver detalle">
          <FiEye />
        </button>
      </td>
    </tr>
  );
};
