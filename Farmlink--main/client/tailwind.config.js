/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'], theme: { extend: { colors: { forest: '#064e3b', leaf: '#16834c', lime: '#d9f99d', cream: '#f7f8f4' }, fontFamily: { sans: ['Inter','ui-sans-serif','system-ui'] }, boxShadow: { soft: '0 12px 38px rgba(15,55,35,.08)' } } }, plugins: [] };
