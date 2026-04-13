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
        background: '#f4efe8',
        panel: 'rgba(255,250,245,0.88)',
        brand: {
          DEFAULT: '#1f6b5f',
          deep: '#184f46',
          light: '#e8f4f1',
          muted: 'rgba(31,107,95,0.12)'
        },
        accent: {
          DEFAULT: '#c78646',
          light: '#fdf3e6',
          muted: 'rgba(199,134,70,0.12)'
        },
        danger: {
          DEFAULT: '#a93d32',
          light: 'rgba(169,61,50,0.08)'
        },
        line: 'rgba(85,62,42,0.12)',
        textPrimary: '#1f1a17',
        textMuted: '#65574d'
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
        card: '0 24px 70px rgba(84,61,41,0.14)',
        soft: '0 16px 34px rgba(57,40,25,0.10)',
        focus: '0 0 0 4px rgba(31,107,95,0.12)'
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
