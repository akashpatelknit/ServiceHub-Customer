import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const hsl = (variable: string) => `hsl(var(${variable}))`;

const colorFamily = (prefix: string) => ({
  DEFAULT: hsl(`--${prefix}`),
  foreground: hsl(`--${prefix}-foreground`),
  hover: hsl(`--sh-${prefix}-hover`),
  active: hsl(`--sh-${prefix}-active`),
  subtle: hsl(`--sh-${prefix}-subtle`),
  'subtle-text': hsl(`--sh-${prefix}-subtle-text`),
  'subtle-border': hsl(`--sh-${prefix}-subtle-border`),
});

const statusFamily = (name: string) => ({
  bg: hsl(`--sh-status-${name}-bg`),
  text: hsl(`--sh-status-${name}-text`),
  border: hsl(`--sh-status-${name}-border`),
});

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        lg: '1024px',
      },
      colors: {
        border: hsl('--border'),
        input: hsl('--input'),
        ring: hsl('--ring'),
        background: hsl('--background'),
        foreground: hsl('--foreground'),
        card: { DEFAULT: hsl('--card'), foreground: hsl('--card-foreground') },
        popover: { DEFAULT: hsl('--popover'), foreground: hsl('--popover-foreground') },
        muted: { DEFAULT: hsl('--muted'), foreground: hsl('--muted-foreground') },
        destructive: { DEFAULT: hsl('--destructive'), foreground: hsl('--destructive-foreground') },
        // Structural neutral hover/highlight background — what shadcn's generated
        // components (ghost button, select item hover, etc.) actually mean by
        // "accent". Distinct from the admin's violet brand accent, see `violet` below.
        accent: { DEFAULT: hsl('--accent'), foreground: hsl('--accent-foreground') },

        primary: colorFamily('primary'),
        secondary: colorFamily('secondary'),
        // Admin's brand accent color (violet) — named separately from `accent` above
        // so it never collides with shadcn's structural neutral-hover convention.
        violet: {
          DEFAULT: hsl('--sh-accent'),
          foreground: hsl('--sh-accent-foreground'),
          hover: hsl('--sh-accent-hover'),
          active: hsl('--sh-accent-active'),
          subtle: hsl('--sh-accent-subtle'),
          'subtle-text': hsl('--sh-accent-subtle-text'),
          'subtle-border': hsl('--sh-accent-subtle-border'),
        },
        danger: {
          DEFAULT: hsl('--sh-danger'),
          hover: hsl('--sh-danger-hover'),
          active: hsl('--sh-danger-active'),
          subtle: hsl('--sh-danger-subtle'),
          'subtle-text': hsl('--sh-danger-subtle-text'),
          'subtle-border': hsl('--sh-danger-subtle-border'),
        },
        warning: {
          DEFAULT: hsl('--sh-warning'),
          hover: hsl('--sh-warning-hover'),
          active: hsl('--sh-warning-active'),
          subtle: hsl('--sh-warning-subtle'),
          'subtle-text': hsl('--sh-warning-subtle-text'),
          'subtle-border': hsl('--sh-warning-subtle-border'),
        },

        surface: {
          DEFAULT: hsl('--card'),
          hover: hsl('--sh-surface-hover'),
          sunken: hsl('--sh-surface-sunken'),
        },
        line: {
          DEFAULT: hsl('--border'),
          strong: hsl('--sh-border-strong'),
        },
        ink: {
          primary: hsl('--foreground'),
          secondary: hsl('--sh-ink-secondary'),
          muted: hsl('--sh-ink-muted'),
          link: hsl('--sh-ink-link'),
        },

        'status-active': statusFamily('active'),
        'status-inactive': statusFamily('inactive'),
        'status-pending': statusFamily('pending'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        btn: 'var(--radius)',
        card: '0.75rem',
        pill: '9999px',
      },
      fontFamily: {
        sans: ['Poppins', 'Lexend', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
      transitionProperty: {
        theme: 'background-color, border-color, color, box-shadow',
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
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
