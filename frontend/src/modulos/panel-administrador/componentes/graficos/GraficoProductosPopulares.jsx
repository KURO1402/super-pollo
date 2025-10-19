import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";

const data = [
  { producto: "Pollo a la Brasa", ventas: 245 },
  { producto: "1/4 Pollo", ventas: 189 },
  { producto: "Inca Kola 500ml", ventas: 156 },
  { producto: "Ensalada Mixta", ventas: 134 },
  { producto: "Papas Fritas", ventas: 98 },
];

const GraficoProductosPopulares = () => {
  const { themeColors } = useTemaParaGraficos();

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid 
            stroke={themeColors.grid} 
            strokeDasharray="3 3" 
            horizontal={false} 
          />
          <XAxis 
            type="number" 
            stroke={themeColors.textSecondary}
            fontSize={11}
            tickFormatter={(value) => `${value} ventas`}
          />
          <YAxis 
            type="category" 
            dataKey="producto" 
            stroke={themeColors.textSecondary}
            width={80}
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '8px',
              fontSize: '11px'
            }}
            formatter={(value) => [`${value} ventas`, '']}
          />
          <Bar 
            dataKey="ventas" 
            fill={themeColors.primary}
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoProductosPopulares;