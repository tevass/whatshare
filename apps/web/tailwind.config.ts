import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        woodsmoke: {
          '50': 'hsl(var(--woodsmoke-50))',
          '100': 'hsl(var(--woodsmoke-100))',
          '200': 'hsl(var(--woodsmoke-200))',
          '300': 'hsl(var(--woodsmoke-300))',
          '400': 'hsl(var(--woodsmoke-400))',
          '500': 'hsl(var(--woodsmoke-500))',
          '600': 'hsl(var(--woodsmoke-600))',
          '700': 'hsl(var(--woodsmoke-700))',
          '800': 'hsl(var(--woodsmoke-800))',
          '900': 'hsl(var(--woodsmoke-900))',
          '950': 'hsl(var(--woodsmoke-950))',
        },
        'mountain-meadow': {
          '50': 'hsl(var(--mountain-meadow-50))',
          '100': 'hsl(var(--mountain-meadow-100))',
          '200': 'hsl(var(--mountain-meadow-200))',
          '300': 'hsl(var(--mountain-meadow-300))',
          '400': 'hsl(var(--mountain-meadow-400))',
          '500': 'hsl(var(--mountain-meadow-500))',
          '600': 'hsl(var(--mountain-meadow-600))',
          '700': 'hsl(var(--mountain-meadow-700))',
          '800': 'hsl(var(--mountain-meadow-800))',
          '900': 'hsl(var(--mountain-meadow-900))',
          '950': 'hsl(var(--mountain-meadow-950))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      gridTemplateColumns: {
        chats: '380px 1fr',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
