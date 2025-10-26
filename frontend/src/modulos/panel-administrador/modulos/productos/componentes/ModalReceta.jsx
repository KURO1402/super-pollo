// components/ModalReceta.jsx
import { useState } from 'react';

// Data temporal para ingredientes
const ingredientesEjemplo = [
  { id: 1, nombre: "Pollo entero", cantidad: 0.4, unidad: "kg", costo: 3.40 },
  { id: 2, nombre: "Papas", cantidad: 0.25, unidad: "kg", costo: 0.63 },
  { id: 3, nombre: "Lechuga", cantidad: 0.05, unidad: "kg", costo: 0.15 },
  { id: 4, nombre: "Envase mediano", cantidad: 1, unidad: "unidades", costo: 0.50 },
  { id: 5, nombre: "Tomate", cantidad: 45, unidad: "kg", costo: 6.00 }
];

export const ModalReceta = ({ producto, onClose }) => {
  const [ingredientes, setIngredientes] = useState(ingredientesEjemplo); // estado para los ingredientes de la receta
  const [nuevoIngrediente, setNuevoIngrediente] = useState({ // estado para el nuevo ingrediente a agregar
    insumo: "",
    cantidad: 0
  });
  // calcular el costo total de los ingredientes    
  const costoTotal = ingredientes.reduce((total, ing) => total + ing.costo, 0);
  // funciones para agregar y eliminar ingredientes
  const handleAgregarIngrediente = () => {
    if (nuevoIngrediente.insumo && nuevoIngrediente.cantidad > 0) {
      const nuevo = {
        id: Date.now(),
        nombre: nuevoIngrediente.insumo,
        cantidad: nuevoIngrediente.cantidad,
        unidad: "kg",
        costo: nuevoIngrediente.cantidad * 10
      };
      setIngredientes([...ingredientes, nuevo]);
      setNuevoIngrediente({ insumo: "", cantidad: 0 });
    }
  };
  // funcion para eliminar ingrediente
  const handleEliminarIngrediente = (id) => {
    setIngredientes(ingredientes.filter(ing => ing.id !== id));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">
        Define los ingredientes y cantidades necesarias para preparar este producto
      </p>

      {/* Sección para agregar ingrediente */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agregar Ingrediente
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar insumo
            </label>
            <select
              value={nuevoIngrediente.insumo}
              onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, insumo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un insumo</option>
              <option value="Pollo entero">Pollo entero</option>
              <option value="Papas">Papas</option>
              <option value="Lechuga">Lechuga</option>
              <option value="Tomate">Tomate</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              step="0.01"
              value={nuevoIngrediente.cantidad}
              onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, cantidad: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAgregarIngrediente}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de ingredientes */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Ingredientes de la receta ({ingredientes.length})
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">INGREDIENTE</th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">CANTIDAD</th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">UNIDAD</th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">COSTO</th>
                <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {ingredientes.map((ingrediente) => (
                <tr key={ingrediente.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{ingrediente.nombre}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{ingrediente.cantidad}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{ingrediente.unidad}</td>
                  <td className="px-4 py-3 font-medium text-green-600 dark:text-green-400">
                    S/{ingrediente.costo.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleEliminarIngrediente(ingrediente.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Costo total */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900 dark:text-white">
            Costo Total de Producción:
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            S/{costoTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Guardar Receta
        </button>
      </div>
    </div>
  );
};