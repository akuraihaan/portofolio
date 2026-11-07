/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Modern Editorial Tech Palette
        ivory: {
          DEFAULT: '#faf8f5',
          50: '#ffffff',
          100: '#faf8f5',
          200: '#f3f0e8',
          300: '#e8e4d8',
          400: '#dcd7c8',
        },
        charcoal: {
          DEFAULT: '#141518',
          950: '#0c0d10',
          900: '#141518',
          800: '#1d1f24',
          700: '#2b2d35',
          600: '#464954',
          500: '#646774',
          400: '#8b8e9b',
          300: '#b8bac4',
        },
        lime: {
          DEFAULT: '#d4ff00',
          hover: '#bcee00',
          dark: '#a8cf00',
          glow: 'rgba(212, 255, 0, 0.45)',
        },
        forest: {
          DEFAULT: '#0c382f',
          light: '#135446',
          muted: '#1b7461',
        },
        // Dark Mode tokens
        dark: {
          canvas: '#0c0d10',
          surface: '#14151b',
          subtle: '#1b1d25',
          border: '#232530',
          text: '#f3f4f7',
          muted: '#8e92a0',
        },
      },
      boxShadow: {
        'lime-glow': '0 0 25px -4px rgba(212, 255, 0, 0.45), 0 0 10px -2px rgba(212, 255, 0, 0.3)',
        'editorial': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'editorial-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
