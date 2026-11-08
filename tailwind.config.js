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
        // BWORIEY Contemporary Swiss Creative-Tech Palette
        bw: {
          bg: '#F4F3EE',
          primary: '#171816',
          surface: '#E9E8E1',
          accent: '#C8F169',
          muted: '#777970',
          darkBg: '#111310',
          darkPrimary: '#F4F3EE',
          darkSurface: '#1C1F1A',
          darkAccent: '#C8F169',
          darkMuted: '#A1A49A',
        },
        // Semantic Editorial Tokens
        ivory: {
          DEFAULT: '#F4F3EE',
          50: '#FFFFFF',
          100: '#F4F3EE',
          200: '#E9E8E1',
          300: '#DEDCD2',
          400: '#C9C6B8',
        },
        charcoal: {
          DEFAULT: '#171816',
          950: '#111310',
          900: '#171816',
          800: '#1C1F1A',
          700: '#2A2E27',
          600: '#474D42',
          500: '#777970',
          400: '#A1A49A',
          300: '#CACDC5',
        },
        lime: {
          DEFAULT: '#C8F169',
          hover: '#BAE655',
          dark: '#A6D43E',
          glow: 'rgba(200, 241, 105, 0.45)',
        },
        forest: {
          DEFAULT: '#171816',
          light: '#2A2E27',
          muted: '#474D42',
        },
        // Dark Mode tokens
        dark: {
          canvas: '#111310',
          surface: '#1C1F1A',
          subtle: '#262A23',
          border: 'rgba(244, 243, 238, 0.12)',
          text: '#F4F3EE',
          muted: '#A1A49A',
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
