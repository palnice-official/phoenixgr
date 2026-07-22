import type {Config} from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {preflight: false},
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0B1B2B',
        'brand-blue': '#1F6FEB',
        'brand-gold': '#C9A24B',
        surface: '#F7F9FB',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': {transform: 'translateX(0)'},
          '100%': {transform: 'translateX(-50%)'},
        },
      },
    },
  },
  plugins: [forms],
} satisfies Config;