/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        evolve: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          panel: 'rgb(var(--color-panel) / <alpha-value>)',
          panelinner: 'rgb(var(--color-panel-inner) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          textMain: 'rgb(var(--color-text-main) / <alpha-value>)',
          textDim: 'rgb(var(--color-text-dim) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          accentHover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          success: 'rgb(var(--color-success) / <alpha-value>)',
          danger: 'rgb(var(--color-danger) / <alpha-value>)',
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
