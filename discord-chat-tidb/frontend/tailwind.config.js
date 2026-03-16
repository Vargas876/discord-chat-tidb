/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores inspirada en Discord
        discord: {
          100: '#F2F3F5',
          200: '#E3E5E8',
          300: '#C9CDD4',
          400: '#96989D',
          500: '#72767D',
          600: '#4F545C',
          700: '#36393F',
          800: '#2F3136',
          900: '#202225',
          950: '#18191C',
        },
        // Colores de marca
        brand: {
          primary: '#5865F2',
          hover: '#4752C4',
          light: '#949CF7',
        },
        // Estados
        success: '#3BA55D',
        warning: '#FAA81A',
        danger: '#ED4245',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
