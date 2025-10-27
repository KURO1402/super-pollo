import { FiPlus, FiMinus, FiBarChart2 } from "react-icons/fi";

const AccionesCaja = ({ cajaAbierta, onIngreso, onEgreso, onArqueo }) => {
  return (
    <div className="flex justify-end">
      <div className="flex gap-3">
        <button
          onClick={onIngreso}
          disabled={!cajaAbierta}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Registrar Ingreso
        </button>
        <button
          onClick={onEgreso}
          disabled={!cajaAbierta}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        >
          <FiMinus className="w-4 h-4" />
          Registrar Egreso
        </button>
        <button
          onClick={onArqueo}
          disabled={!cajaAbierta}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        >
          <FiBarChart2 className="w-4 h-4" />
          Realizar Arqueo
        </button>
      </div>
    </div>
  );
};

export default AccionesCaja;