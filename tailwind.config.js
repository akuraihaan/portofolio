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
      colors: {
        space: {
          950: '#02040a',
          900: '#040716',
          850: '#080d22',
          800: '#0c1433',
          700: '#15214d',
          border: 'rgba(44, 103, 237, 0.18)',
        },
        accent: {
          DEFAULT: '#2c67ed',
          hover: '#437cff',
          glow: 'rgba(44, 103, 237, 0.45)',
          light: '#6ba0ff',
          dark: '#1b4ec0',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 25px -4px rgba(44, 103, 237, 0.45), 0 0 10px -2px rgba(44, 103, 237, 0.3)',
        'glow-blue-lg': '0 0 40px -2px rgba(44, 103, 237, 0.55), 0 0 20px -2px rgba(44, 103, 237, 0.35)',
        'glow-subtle': '0 0 15px rgba(44, 103, 237, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'star-twinkle': 'twinkle 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%': { opacity: '0.2', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

