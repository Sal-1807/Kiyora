/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'app-bg': '#F7F7F5',
      },
      boxShadow: {
        soft: '0 1px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)',
        lift: '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
