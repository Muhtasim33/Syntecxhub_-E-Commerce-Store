import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: 'var(--color-emerald-950)',
        },
        olive: {
          700: 'var(--color-olive-700)',
          800: 'var(--color-olive-800)',
        },
        cream: {
          100: 'var(--color-cream-100)',
          300: 'var(--color-cream-300)',
        },
        gold: {
          400: 'var(--color-gold-400)',
        },
        brand: {
          dark: 'var(--color-emerald-950)',
          primary: 'var(--color-olive-800)',
          primaryHover: 'var(--color-olive-700)',
          light: 'var(--color-cream-100)',
          border: 'var(--color-cream-300)',
          muted: 'var(--color-muted)',
          accent: 'var(--color-gold-400)',
        },
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
