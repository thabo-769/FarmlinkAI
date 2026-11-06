/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfaf3',
          100: '#d4f4e2',
          200: '#a7e8c4',
          300: '#52c98a',
          400: '#1fb06a',
          500: '#0a9455',
          600: '#087843',
          700: '#076b40',
          800: '#064e30',
          900: '#052e1c',
        },
        forest: '#052e1c',
        leaf: '#087843',
        lime: '#c8f07a',
        cream: '#f5f7f5',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        soft: '0 4px 18px rgba(10,40,22,.09)',
      },
    },
  },
  plugins: [],
};
