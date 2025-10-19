import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";

const data = [
  { dia: "Lun", reservas: 12, ocupacion: 65 },
  { dia: "Mar", reservas: 15, ocupacion: 75 },
  { dia: "Mié", reservas: 18, ocupacion: 85 },
  { dia: "Jue", reservas: 22, ocupacion: 95 },
  { dia: "Vie", reservas: 28, ocupacion: 98 },
  { dia: "Sáb", reservas: 35, ocupacion: 100 },
  { dia: "Dom", reservas: 25, ocupacion: 90 },
];

const GraficoReservas = () => {
  const { themeColors } = useTemaParaGraficos();

  return (
    <div className="w-full h-80 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tendencia de Reservas Semanal
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke={themeColors.grid} strokeDasharray="3 3" />
          <XAxis dataKey="dia" stroke={themeColors.text} />
          <YAxis stroke={themeColors.text} />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.grid}`,
              color: themeColors.text,
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="ocupacion" 
            fill={themeColors.primary}
            fillOpacity={0.3}
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="reservas"
            stroke={themeColors.primary}
            strokeWidth={3}
            dot={{ r: 5, fill: themeColors.primary }}
            activeDot={{ r: 8, fill: themeColors.accent }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoReservas;