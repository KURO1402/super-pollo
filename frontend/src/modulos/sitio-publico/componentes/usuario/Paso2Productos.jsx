import { useState, useEffect } from 'react';
import { FiCheck } from "react-icons/fi";
import { MdTableBar, MdDoorFront, MdStairs } from "react-icons/md";
import { reservaEstadoGlobal } from "../../estado-global/reservaEstadoGlobal";

const Paso2SeleccionMesas = () => {
  const { datos, updateDatos } = reservaEstadoGlobal();
  const [pisoActual, setPisoActual] = useState(1);
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);
  const [error, setError] = useState('');
  
  const personasForm = datos.personas || 2;
  const fechaForm = datos.fecha;
  const horaForm = datos.hora;

  // Calcular número de mesas necesarias
  const mesasNecesarias = Math.ceil(personasForm / 4);

  // Mesas del primer piso
  const mesasPrimerPiso = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    numero: `1-${i + 1}`,
    capacidad: 4,
    piso: 1,
    disponible: true
  }));

  // Mesas del segundo piso (5 mesas, capacidad 8 c/u)
  const mesasSegundoPiso = Array.from({ length: 5 }, (_, i) => ({
    id: i + 13,
    numero: `2-${i + 1}`,
    capacidad: 8,
    piso: 2,
    disponible: true
  }));

  const mesasActuales = pisoActual === 1 ? mesasPrimerPiso : mesasSegundoPiso;

  useEffect(() => {
    // Cargar mesas previamente seleccionadas si existen
    if (datos.mesas && datos.mesas.length > 0) {
      setMesasSeleccionadas(datos.mesas);
    }
  }, []);

  useEffect(() => {
    // Si cambia el número de personas limpiar selección si excede
    if (mesasSeleccionadas.length > mesasNecesarias) {
      const nuevaSeleccion = mesasSeleccionadas.slice(0, mesasNecesarias);
      setMesasSeleccionadas(nuevaSeleccion);
      updateDatos({ mesas: nuevaSeleccion });
    }
  }, [personasForm, mesasNecesarias]);

  useEffect(() => {
    // Validar seleccion de mesas
    if (mesasSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una mesa');
    } else if (mesasSeleccionadas.length < mesasNecesarias) {
      setError(`Necesitas seleccionar ${mesasNecesarias} ${mesasNecesarias === 1 ? 'mesa' : 'mesas'}`);
    } else {
      setError('');
    }
  }, [mesasSeleccionadas, mesasNecesarias]);

  const handleSeleccionarMesa = (mesa) => {
    if (!mesa.disponible) return;

    let nuevaSeleccion;
    const estaSeleccionada = mesasSeleccionadas.some(m => m.numero === mesa.numero);

    if (estaSeleccionada) {
      // Deseleccionar
      nuevaSeleccion = mesasSeleccionadas.filter(m => m.numero !== mesa.numero);
    } else {
      // Seleccionar si no se ha alcanzado el limite
      if (mesasSeleccionadas.length < mesasNecesarias) {
        nuevaSeleccion = [...mesasSeleccionadas, mesa];
      } else {
        // Reemplazar la ultima seleccionada
        nuevaSeleccion = [...mesasSeleccionadas.slice(0, -1), mesa];
      }
    }

    setMesasSeleccionadas(nuevaSeleccion);
    updateDatos({ mesas: nuevaSeleccion });
  };

  const esMesaSeleccionada = (mesa) => {
    return mesasSeleccionadas.some(m => m.numero === mesa.numero);
  };

  const capacidadTotal = mesasSeleccionadas.reduce((total, mesa) => total + mesa.capacidad, 0);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-4 md:px-0">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Selecciona tus Mesas
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          Elige las mesas para tu reserva de {personasForm} {personasForm === 1 ? 'persona' : 'personas'}
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MdTableBar className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Mesas Requeridas: {mesasNecesarias}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              Capacidad seleccionada: {capacidadTotal} personas
            </p>
          </div>

          {/* Switch de Pisos */}
          <div className="flex items-center gap-2 bg-gray-700 rounded-full p-1 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setPisoActual(1)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all flex-1 md:flex-initial justify-center ${
                pisoActual === 1
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MdDoorFront className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Piso 1</span>
            </button>
            <button
              type="button"
              onClick={() => setPisoActual(2)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all flex-1 md:flex-initial justify-center ${
                pisoActual === 2
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MdStairs className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Piso 2</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 border-2 border-gray-500 rounded"></div>
            <span className="text-gray-300">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 border-2 border-red-500 rounded"></div>
            <span className="text-gray-300">Seleccionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 border-2 border-gray-500 rounded opacity-50"></div>
            <span className="text-gray-300">No disponible</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg border border-gray-700 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 bg-blue-600/10 border border-blue-600/30 rounded-lg px-4 py-2">
              <MdDoorFront className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm md:text-base">Entrada</span>
            </div>
            <div className="text-center">
              <h4 className="text-lg md:text-xl font-bold text-white">
                {pisoActual === 1 ? 'Primer Piso' : 'Segundo Piso'}
              </h4>
              <p className="text-xs md:text-sm text-gray-400">
                {pisoActual === 1 ? '12 mesas • 4 personas c/u' : '5 mesas • 8 personas c/u'}
              </p>
            </div>
            <div className="w-24"></div>
          </div>

          {pisoActual === 1 ? (
            <div className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-6 gap-3 md:gap-6">
                {mesasPrimerPiso.slice(0, 6).map((mesa) => {
                  const seleccionada = esMesaSeleccionada(mesa);
                  return (
                    <button
                      key={mesa.id}
                      type="button"
                      onClick={() => handleSeleccionarMesa(mesa)}
                      disabled={!mesa.disponible}
                      className={`relative aspect-square rounded-xl transition-all transform hover:scale-105 ${
                        !mesa.disponible
                          ? 'bg-gray-600 border-2 border-gray-500 opacity-50 cursor-not-allowed'
                          : seleccionada
                          ? 'bg-red-600 border-2 border-red-400 shadow-lg shadow-red-600/50'
                          : 'bg-gray-700 border-2 border-gray-500 hover:border-red-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <MdTableBar className={`w-6 h-6 md:w-8 md:h-8 mb-1 ${
                          seleccionada ? 'text-white' : 'text-gray-400'
                        }`} />
                        <span className={`text-xs md:text-sm font-bold ${
                          seleccionada ? 'text-white' : 'text-gray-300'
                        }`}>
                          {mesa.numero}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400">
                          {mesa.capacidad}p
                        </span>
                        {seleccionada && (
                          <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                            <FiCheck className="w-3 h-3 text-red-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

              <div className="grid grid-cols-6 gap-3 md:gap-6">
                {mesasPrimerPiso.slice(6, 12).map((mesa) => {
                  const seleccionada = esMesaSeleccionada(mesa);
                  return (
                    <button
                      key={mesa.id}
                      type="button"
                      onClick={() => handleSeleccionarMesa(mesa)}
                      disabled={!mesa.disponible}
                      className={`relative aspect-square rounded-xl transition-all transform hover:scale-105 ${
                        !mesa.disponible
                          ? 'bg-gray-600 border-2 border-gray-500 opacity-50 cursor-not-allowed'
                          : seleccionada
                          ? 'bg-red-600 border-2 border-red-400 shadow-lg shadow-red-600/50'
                          : 'bg-gray-700 border-2 border-gray-500 hover:border-red-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <MdTableBar className={`w-6 h-6 md:w-8 md:h-8 mb-1 ${
                          seleccionada ? 'text-white' : 'text-gray-400'
                        }`} />
                        <span className={`text-xs md:text-sm font-bold ${
                          seleccionada ? 'text-white' : 'text-gray-300'
                        }`}>
                          {mesa.numero}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400">
                          {mesa.capacidad}p
                        </span>
                        {seleccionada && (
                          <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                            <FiCheck className="w-3 h-3 text-red-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                {mesasSegundoPiso.slice(0, 3).map((mesa) => {
                  const seleccionada = esMesaSeleccionada(mesa);
                  return (
                    <button
                      key={mesa.id}
                      type="button"
                      onClick={() => handleSeleccionarMesa(mesa)}
                      disabled={!mesa.disponible}
                      className={`relative aspect-square rounded-xl transition-all transform hover:scale-105 ${
                        !mesa.disponible
                          ? 'bg-gray-600 border-2 border-gray-500 opacity-50 cursor-not-allowed'
                          : seleccionada
                          ? 'bg-red-600 border-2 border-red-400 shadow-lg shadow-red-600/50'
                          : 'bg-gray-700 border-2 border-gray-500 hover:border-red-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <MdTableBar className={`w-8 h-8 md:w-10 md:h-10 mb-1 ${
                          seleccionada ? 'text-white' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm md:text-base font-bold ${
                          seleccionada ? 'text-white' : 'text-gray-300'
                        }`}>
                          {mesa.numero}
                        </span>
                        <span className="text-xs md:text-sm text-gray-400">
                          {mesa.capacidad}p
                        </span>
                        {seleccionada && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <FiCheck className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

              <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
                {mesasSegundoPiso.slice(3, 5).map((mesa) => {
                  const seleccionada = esMesaSeleccionada(mesa);
                  return (
                    <button
                      key={mesa.id}
                      type="button"
                      onClick={() => handleSeleccionarMesa(mesa)}
                      disabled={!mesa.disponible}
                      className={`relative aspect-square rounded-xl transition-all transform hover:scale-105 ${
                        !mesa.disponible
                          ? 'bg-gray-600 border-2 border-gray-500 opacity-50 cursor-not-allowed'
                          : seleccionada
                          ? 'bg-red-600 border-2 border-red-400 shadow-lg shadow-red-600/50'
                          : 'bg-gray-700 border-2 border-gray-500 hover:border-red-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <MdTableBar className={`w-8 h-8 md:w-10 md:h-10 mb-1 ${
                          seleccionada ? 'text-white' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm md:text-base font-bold ${
                          seleccionada ? 'text-white' : 'text-gray-300'
                        }`}>
                          {mesa.numero}
                        </span>
                        <span className="text-xs md:text-sm text-gray-400">
                          {mesa.capacidad}p
                        </span>
                        {seleccionada && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <FiCheck className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {mesasSeleccionadas.length > 0 && (
        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
          <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
            Mesas Seleccionadas
          </h4>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {mesasSeleccionadas.map((mesa) => (
              <div
                key={mesa.numero}
                className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-lg px-3 md:px-4 py-2"
              >
                <MdTableBar className="w-4 h-4 text-red-400" />
                <span className="text-sm md:text-base text-white font-medium">
                  Mesa {mesa.numero}
                </span>
                <span className="text-xs md:text-sm text-gray-400">
                  ({mesa.capacidad}p)
                </span>
              </div>
            ))}
          </div>
          
          {mesasSeleccionadas.length >= mesasNecesarias && (
            <div className="mt-4 bg-green-600/10 border border-green-600/30 rounded-lg p-3">
              <p className="text-green-400 text-sm md:text-base text-center font-medium">
                ✓ Perfecto! Has seleccionado {mesasSeleccionadas.length} {mesasSeleccionadas.length === 1 ? 'mesa' : 'mesas'} con capacidad total de {capacidadTotal} personas
              </p>
            </div>
          )}
        </div>
      )}

      {error && mesasSeleccionadas.length < mesasNecesarias && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-500 text-sm md:text-base">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Paso2SeleccionMesas;