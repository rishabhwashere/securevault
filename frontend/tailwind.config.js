/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      './index.html',
      './src/**/*.{ts,tsx}'
    ]
  },
  theme: {
    extend: {
      colors: {
        background: '#090909',
        panel: 'rgba(16,16,16,0.92)',
        surface: {
          DEFAULT: '#151515',
          raised: '#222222',
          soft: 'rgba(27,27,27,0.92)',
          muted: 'rgba(255,255,255,0.06)',
          sunken: '#0f0f0f'
        },
        brand: {
          DEFAULT: '#f3f3f3',
          deep: '#d2d2d2',
          light: 'rgba(255,255,255,0.14)',
          muted: 'rgba(255,255,255,0.1)'
        },
        accent: {
          DEFAULT: '#a8a8a8',
          light: 'rgba(255,255,255,0.1)',
          muted: 'rgba(255,255,255,0.08)'
        },
        danger: {
          DEFAULT: '#d8d8d8',
          light: 'rgba(255,255,255,0.1)'
        },
        line: 'rgba(255,255,255,0.1)',
        textPrimary: '#f4f4f4',
        textMuted: '#8c8c8c'
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Fraunces"', 'Georgia', 'serif']
      },
      borderRadius: {
        xl: '28px',
        lg: '20px',
        md: '16px',
        sm: '10px'
      },
      boxShadow: {
        card: '0 28px 80px rgba(0,0,0,0.38)',
        soft: '0 18px 42px rgba(0,0,0,0.28)',
        focus: '0 0 0 4px rgba(255,255,255,0.12)'
      },
      backdropBlur: {
        panel: '16px'
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out',
        float: 'float 8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.65' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
