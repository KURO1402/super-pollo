
import { useTheme } from "../context/ThemeContext"; // o donde tengas tu contexto de tema

export const useTemaParaGraficos = () => {
  const { theme } = useTheme(); // Asumiendo que tienes un contexto de tema

  // Paleta de colores elegante y moderna
  const elegantColors = {
    // Colores principales - escala de azules sofisticados
    primary: '#2563eb',     // blue-600 - más profesional que blue-500
    primaryLight: '#3b82f6', // blue-500
    primaryDark: '#1d4ed8',  // blue-700
    
    // Colores neutros para temas
    dark: {
      background: '#111827',    // gray-900 - más oscuro y elegante
      card: '#1f2937',         // gray-800
      text: '#f9fafb',         // gray-50 - mejor contraste
      textSecondary: '#d1d5db', // gray-300
      grid: '#374151',         // gray-700
      border: '#4b5563'        // gray-600
    },
    light: {
      background: '#f8fafc',    // gray-50 - fondo más suave
      card: '#ffffff',
      text: '#1e293b',         // slate-800 - más elegante que gray-700
      textSecondary: '#64748b', // slate-500
      grid: '#e2e8f0',         // slate-200
      border: '#cbd5e1'        // slate-300
    },
    
    // Colores funcionales sutiles
    success: '#059669',     // emerald-600 - más sofisticado
    warning: '#d97706',     // amber-600
    danger: '#dc2626',      // red-600
    info: '#0369a1'         // sky-700
  };

  const themeColors = theme === 'dark' ? {
    background: elegantColors.dark.card,
    text: elegantColors.dark.text,
    textSecondary: elegantColors.dark.textSecondary,
    grid: elegantColors.dark.grid,
    border: elegantColors.dark.border,
    primary: elegantColors.primary,
    primaryLight: elegantColors.primaryLight,
    primaryDark: elegantColors.primaryDark,
    success: elegantColors.success,
    warning: elegantColors.warning,
    danger: elegantColors.danger,
    info: elegantColors.info
  } : {
    background: elegantColors.light.card,
    text: elegantColors.light.text,
    textSecondary: elegantColors.light.textSecondary,
    grid: elegantColors.light.grid,
    border: elegantColors.light.border,
    primary: elegantColors.primary,
    primaryLight: elegantColors.primaryLight,
    primaryDark: elegantColors.primaryDark,
    success: elegantColors.success,
    warning: elegantColors.warning,
    danger: elegantColors.danger,
    info: elegantColors.info
  };

  return { themeColors };
};