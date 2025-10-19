import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";

const data = [
  { mes: "Ene", ventas: 45000, egresos: 28000 },
  { mes: "Feb", ventas: 52000, egresos: 32000 },
  { mes: "Mar", ventas: 48000, egresos: 29000 },
  { mes: "Abr", ventas: 61000, egresos: 35000 },
  { mes: "May", ventas: 55000, egresos: 33000 },
  { mes: "Jun", ventas: 59000, egresos: 36000 },
];

const GraficoVentasEgresos = () => {
  const { themeColors } = useTemaParaGraficos();

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={themeColors.grid} strokeDasharray="3 3" />
          <XAxis 
            dataKey="mes" 
            stroke={themeColors.textSecondary}
            fontSize={12}
          />
          <YAxis 
            stroke={themeColors.textSecondary}
            fontSize={12}
            tickFormatter={(value) => `S/ ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value) => [`S/ ${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Bar 
            dataKey="ventas" 
            fill={themeColors.primary} 
            name="Ventas" 
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="egresos" 
            fill={themeColors.danger} 
            name="Egresos" 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVentasEgresos;