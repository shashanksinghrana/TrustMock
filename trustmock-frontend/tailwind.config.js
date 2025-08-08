/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#004481',
        accent: '#0072CE',
        surface: '#F0F4F8',
        success: '#007F5F',
        danger: '#FF4D4F'
      }
    }
  },
  plugins: []
}
