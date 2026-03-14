/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        panel: '#121a2b',
        panelSoft: '#182235',
        line: '#273449',
        accent: '#f97316',
        accentSoft: '#fb923c',
      },
      boxShadow: {
        panel: '0 24px 60px rgba(2, 6, 23, 0.45)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(249, 115, 22, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 22%)',
      },
    },
  },
  plugins: [],
}
