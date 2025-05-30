/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          github: {
            50: '#f6f8fa',
            100: '#eaeef2',
            200: '#d0d7de',
            300: '#afb8c1',
            400: '#8c959f',
            500: '#6e7781',
            600: '#57606a',
            700: '#424a53',
            800: '#32383f',
            900: '#24292f',
          },
          success: {
            50: '#f0fff4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          chart: {
            1: '#8b5cf6',
            2: '#06b6d4',
            3: '#10b981',
            4: '#f59e0b',
            5: '#ef4444',
          },
        },
        fontFamily: {
          mono: ['var(--font-mono)', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-subtle': 'bounceSubtle 2s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          bounceSubtle: {
            '0%, 100%': {
              transform: 'translateY(-5%)',
              animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            },
            '50%': {
              transform: 'none',
              animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            },
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'github-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f6f8fa' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        },
        boxShadow: {
          'github': '0 1px 3px rgba(27, 31, 35, 0.12), 0 8px 24px rgba(66, 74, 83, 0.12)',
          'stat-card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        backdropBlur: {
          xs: '2px',
        },
      },
    },
    plugins: [],
  }