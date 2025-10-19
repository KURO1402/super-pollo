import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";


const data = [
  { name: "Pollo a la Brasa", value: 45 },
  { name: "Medio Pollo", value: 20 },
  { name: "Cuarto de Pollo", value: 15 },
  { name: "Bebidas", value: 12 },
  { name: "Entradas", value: 8 },
];

const GraficoCategoriasProductos = () => {
  const { themeColors } = useTemaParaGraficos();

  const COLORS = [
    themeColors.primary,
    themeColors.primaryLight,
    themeColors.info,
    themeColors.success,
    themeColors.warning
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend 
            iconSize={8}
            wrapperStyle={{
              fontSize: '12px',
              color: themeColors.textSecondary
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCategoriasProductos;