/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",        // analiza el HTML raíz
    "./src/**/*.{js,jsx}", // analiza todos los componentes de React
  ],
  theme: {
    extend: {
      colors: {
        amarillo: "#ffa10a", // amarillo/dorado
        rojo: "#d00000",  // rojo intenso
        azulPrimario: "#021627",  // azul
        azulSecundario: "#010b14", // azul oscuro
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
