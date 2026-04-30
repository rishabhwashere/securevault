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
        background: '#F0F6FF',
        panel: 'rgba(246, 248, 255, 0.92)',
        surface: '#F6F8FF',
        'surface-soft': '#EEF3FB',
        'surface-muted': '#E6EDF8',
        'surface-raised': '#FFFFFF',
        'surface-sunken': '#DCE6F3',
        brand: {
          DEFAULT: '#1F5FA6',
          deep: '#0B3060',
          light: '#C9DEFF',
          muted: 'rgba(31, 95, 166, 0.12)'
        },
        accent: {
          DEFAULT: '#5B9BD5',
          light: '#DDE9FB',
          muted: 'rgba(91, 155, 213, 0.14)'
        },
        steel: {
          DEFAULT: '#607D8B',
          light: '#B8C6D8',
          muted: 'rgba(96, 125, 139, 0.16)'
        },
        danger: {
          DEFAULT: '#B34B54',
          light: 'rgba(179, 75, 84, 0.10)'
        },
        line: 'rgba(96, 125, 139, 0.22)',
        textPrimary: '#183B63',
        textMuted: '#607D8B'
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
        card: '0 18px 48px rgba(31, 95, 166, 0.12)',
        soft: '0 10px 28px rgba(96, 125, 139, 0.12)',
        focus: '0 0 0 4px rgba(91, 155, 213, 0.18)'
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
