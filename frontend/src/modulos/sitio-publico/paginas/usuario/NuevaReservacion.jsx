import { FormProvider, useForm } from "react-hook-form";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";
import PasosNavegacion from "../../componentes/usuario/PasosNavegacion";
import Paso1DatosBasicos from "../../componentes/usuario/Paso1DatosBasicos";
import Paso2Productos from "../../componentes/usuario/Paso2Productos";
import Paso3Confirmacion from "../../componentes/usuario/Paso3Confirmacion";

const NuevaReservacion = () => {
  const { 
    pasoActual, 
    setPaso, 
    datos, 
    updateDatos
  } = reservaEstadoGlobal();

  const methods = useForm({
    defaultValues: {
      fecha: datos.fecha || '',
      hora: datos.hora || '',
      personas: datos.personas || 2,
      mesa: datos.mesa || '',
      notas: datos.notas || ''
    },
    mode: "onChange"
  });

  const { handleSubmit, formState: { isValid } } = methods;

  const onSubmitPaso1 = (data) => {
    updateDatos(data);
    setPaso(2);
  };

  const handleAvanzarPaso2 = () => {
    if (datos.productos.length > 0) {
      setPaso(3);
    }
  };

  const puedeAvanzarPaso1 = isValid;
  const puedeAvanzarPaso2 = datos.productos.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            NUEVA <span className="text-red-600">RESERVACIÓN</span>
          </h1>
          <div className="w-32 h-1 bg-red-600 mx-auto mb-6"></div>
        </header>

        <PasosNavegacion />

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          
          {pasoActual === 1 && (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitPaso1)}>
                <Paso1DatosBasicos />
              </form>
            </FormProvider>
          )}
          
          {pasoActual === 2 && <Paso2Productos />}
          
          {pasoActual === 3 && <Paso3Confirmacion />}
        </div>

        {pasoActual !== 3 && (
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setPaso(pasoActual - 1)}
              disabled={pasoActual === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                pasoActual === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700 text-white hover:scale-105"
              }`}
            >
              <FiArrowLeft className="w-5 h-5" />
              Anterior
            </button>

            {pasoActual === 1 ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmitPaso1)}
                disabled={!puedeAvanzarPaso1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                  !puedeAvanzarPaso1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white hover:scale-105"
                }`}
              >
                Siguiente
                <FiArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAvanzarPaso2}
                disabled={!puedeAvanzarPaso2}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                  !puedeAvanzarPaso2
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white hover:scale-105"
                }`}
              >
                Continuar a Confirmación
                <FiArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {pasoActual === 3 && (
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setPaso(2)}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <FiArrowLeft className="w-5 h-5" />
              Volver a Productos
            </button>

            <button
              type="button"
              onClick={() => {
                reservaEstadoGlobal.getState().resetReserva();
                methods.reset();
              }}
              className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              <FiArrowLeft className="w-5 h-5" />
              Nueva Reservación
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default NuevaReservacion;