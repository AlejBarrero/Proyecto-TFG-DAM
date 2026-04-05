/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#182c62',
          mid: '#508ae8',
          accent: '#fa8a3a',
          soft: '#f3f4f6',
        },
      },
      boxShadow: {
        panel: '0 18px 40px -24px rgba(24, 44, 98, 0.35)',
      },
      backgroundImage: {
        'brand-hero': 'linear-gradient(135deg, rgba(24,44,98,1) 0%, rgba(32,68,142,1) 55%, rgba(80,138,232,1) 100%)',
      },
    },
  },
  plugins: [],
};
