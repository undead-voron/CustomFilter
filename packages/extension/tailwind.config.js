import plugin from 'tailwindcss/plugin'

export default {
  purge: {
    enable: false,
  },
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0db3ea',
        'brand-green': '#2fb947',
        'brand-primary': '#c02d38',
        'brand-gray': '#959595',
        'gray-out': '#818181',
        'gray-bg': '#f6f5f5',
        'dark-gray-bg': '#ebebeb',
      },
      spacing: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'sm/2': '2px',
        'md/2': '3px',
        'lg/2': '4px',
        '2sm': '8px',
        '2md': '12px',
        '2lg': '16px',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      zIndex: {
        max: 2147483647,
      },
      maxWidth: {
        screen: '100vw',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('inverse', '&:where([inverse]:not([inverse=false]), [inverse]:not([inverse=false]) :not([inverse=false], [inverse=false] *))')
    }),
    plugin(({ addComponents, addBase }) => {
      // add default locale related styles
      const h2 = {
        fontSize: '12px',
        lineHeight: '110%',
        color: '#444',
        fontWeight: 'bold',
      }
      const label = {
        fontSize: '12px',
        lineHeight: '1.2em',
        color: 'black',
        fontWeight: 'normal',
      }
      const input = {
        fontSize: '11px',
        lineHeight: '11px',
        color: 'black',
        fontWeight: 'normal',
        padding: '2px 1px',
        border: '1px solid #888',
      }

      const h4 = {
        fontSize: '12px',
        lineHeight: '110%',
        fontWeight: 'bold',
      }

      addBase({
        h2,
        label,
        input,
        select: input,
        h4,
      })

      addComponents({
        '.text-h2': h2,
        '.text-label': label,
        '.text-details': {
          fontSize: '10px',
          lineHeight: '10px',
          color: 'black',
          fontWeight: 'normal',
        },
        // '.marker': {
        //   height: '12px',
        //   width: '12px',
        // },
        // '.marker-wrapper': {
        //   height: '25px',
        //   width: '25px',
        // },
      })
    }),
    plugin(({ matchUtilities, theme, addComponents }) => {
      addComponents({
        '.custom-loader': {
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          borderWidth: '8px',
          borderStyle: 'solid',
          borderColor: theme('colors.brand-primary'),
          animation: 'l20-1 0.8s infinite linear alternate, l20-2 1.6s infinite linear',
          marginInline: 'auto',
        },
        '@keyframes l20-1': {
          '0%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)',
          },
          '12.5%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)',
          },
          '25%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)',
          },
          '50%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '62.5%': {
            'clip-path': 'polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '75%': {
            'clip-path': 'polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '100%': {
            'clip-path': 'polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)',
          },
        },
        '@keyframes l20-2': {
          '0%': {
            transform: 'scaleY(1) rotate(0deg)',
          },
          '49.99%': {
            transform: 'scaleY(1) rotate(135deg)',
          },
          '50%': {
            transform: 'scaleY(-1) rotate(0deg)',
          },
          '100%': {
            transform: 'scaleY(-1) rotate(-135deg)',
          },
        },
      })
      matchUtilities(
        {
          'custom-loader': (value) => {
            return {
              borderColor: value,
            }
          },
        },
        { values: theme('colors') },
      )
    }),
  ],
}
