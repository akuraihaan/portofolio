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
        editorial: ['"Cormorant Garamond"', 'Brier', 'Cinzel', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Brier', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', '"Mona Sans"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      borderRadius: {
        'action': '0.75rem',
        'card': '1rem',
        'panel': '1.5rem',
      },
      colors: {
        // DESIGN.md: Editorial Motorsport System Tokens
        action: '#D1FF00', // Signature Neon Lime
        ink: '#111111',    // Primary Ink / Near Black
        'muted-ink': '#555555', // Secondary body text / Muted Ink
        canvas: '#F5F5F0', // Primary Page Background / Warm Off-White
        surface: '#1A1A1A', // Dark Gallery & Footer Charcoal Surface
        border: '#333333', // Subtle dividers, card outlines on dark
        racing: {
          lime: '#D1FF00',
          ink: '#111111',
          muted: '#555555',
          canvas: '#F5F5F0',
          surface: '#1A1A1A',
          border: '#333333',
        },
        // Neo-Brutalism & Experimental Editorial Palette
        brutal: {
          yellow: '#FFE500', // Acid Yellow
          orange: '#FF5C00', // Electric Orange
          blue: '#0047FF',   // Cobalt Blue
          lime: '#C8F169',   // Acid Lime
          black: '#0A0A0A',  // Deep Brutal Black
          white: '#F4F4F0',  // Off-White canvas
          dark: '#141414',   // Dark brutal surface
          gray: '#E5E5E0',
        },
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
        'brutal': '4px 4px 0px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px 0px #0A0A0A',
        'brutal-lg': '8px 8px 0px 0px #0A0A0A',
        'brutal-xl': '12px 12px 0px 0px #0A0A0A',
        'brutal-yellow': '4px 4px 0px 0px #FFE500',
        'brutal-orange': '4px 4px 0px 0px #FF5C00',
        'brutal-blue': '4px 4px 0px 0px #0047FF',
        'brutal-white': '4px 4px 0px 0px #F4F4F0',
        'brutal-white-lg': '8px 8px 0px 0px #F4F4F0',
        'lime-glow': '0 0 25px -4px rgba(212, 255, 0, 0.45), 0 0 10px -2px rgba(212, 255, 0, 0.3)',
        'editorial': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'editorial-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'pixel': '4px 4px 0px 0px #171816',
        'pixel-lg': '6px 6px 0px 0px #171816',
        'pixel-lime': '4px 4px 0px 0px #C8F169',
        'pixel-lime-lg': '6px 6px 0px 0px #C8F169',
        'pixel-white': '4px 4px 0px 0px #F4F3EE',
        'pixel-inset': 'inset 2px 2px 0px 0px rgba(255,255,255,0.15), inset -2px -2px 0px 0px rgba(0,0,0,0.3)',
        'voxel-elevated': '0 8px 0px #171816, 0 16px 20px rgba(0,0,0,0.15)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
