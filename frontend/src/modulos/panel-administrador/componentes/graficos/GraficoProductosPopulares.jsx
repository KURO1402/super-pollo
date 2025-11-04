import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerTopProductosMasVendidosServicio } from "../../servicios/graficosServicio";

const GraficoProductosPopulares = () => {
  const { themeColors } = useTemaParaGraficos();
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerTopProductosMasVendidosServicio();
        const formateo = respuesta.map(item => ({
          producto: item.nombreProducto,
          ventas: Number(item.totalVendido)
        }));
        console.log(formateo)

        setData(formateo);
      } catch (error) {
        console.error("Error cargando productos más vendidos", error);
      }
    };

    cargarDatos();
  }, []);

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
