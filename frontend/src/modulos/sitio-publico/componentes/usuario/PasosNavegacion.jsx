import { FiCheck } from "react-icons/fi";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";

const PasosNavegacion = () => {
  const { pasoActual } = reservaEstadoGlobal();

  const pasos = [
    { numero: 1, nombre: "Datos Básicos" },
    { numero: 2, nombre: "Productos" },
    { numero: 3, nombre: "Confirmación" }
  ];

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-8">
      <div className="flex justify-between items-center">
        {pasos.map((paso, index) => (
          <div key={paso.numero} className="flex items-center">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                paso.numero === pasoActual
                  ? "bg-red-600 border-red-600 text-white"
                  : paso.numero < pasoActual
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-gray-700 border-gray-600 text-gray-400"
              }`}
            >
              {paso.numero < pasoActual ? <FiCheck className="w-6 h-6" /> : paso.numero}
            </div>
            {index < pasos.length - 1 && (
              <div 
                className={`w-24 h-1 mx-4 ${
                  paso.numero < pasoActual ? "bg-green-500" : "bg-gray-700"
                }`} 
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm font-medium">
        {pasos.map((paso) => (
          <span 
            key={paso.numero}
            className={paso.numero == pasoActual 
              ? "text-red-600" :
              paso.numero < pasoActual ? "text-green-500" :
               "text-gray-500"}
          >
            {paso.nombre}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PasosNavegacion;