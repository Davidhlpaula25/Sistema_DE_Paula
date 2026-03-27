module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#3b82f6',
        },
        success: {
          500: '#10b981',
        },
        sidebar: '#0b1437',
      },
      borderRadius: {
        'premium': '2rem',
      },
    },
  },
  plugins: [],
}
