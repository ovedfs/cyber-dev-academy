/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',      // Fondo principal ultra oscuro
          card: '#12131c',      // Fondos de tarjetas / contenedores
          border: '#1f2438',    // Bordes sutiles de la interfaz
          green: '#00ff66',     // Neón principal (Éxito, XP, Aciertos)
          cyan: '#00e5ff',      // Neón secundario (Botones, Git/React)
          purple: '#9d00ff',    // Neón terciario (Retos de Lógica, Nivel Boss)
          pink: '#ff007f',      // Errores, Vidas perdidas, Avisos
          yellow: '#ffcc00'     // Medallas, Estrellas, Pistas/Tips
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.4)',
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.4)',
        'neon-purple': '0 0 15px rgba(157, 0, 255, 0.4)',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.4)',
        'neon-yellow': '0 0 15px rgba(255, 204, 0, 0.4)',
      }
    },
  },
  plugins: [],
}