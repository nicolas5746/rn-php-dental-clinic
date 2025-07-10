/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './components/**/*.jsx',
    './components/ui/**/*.jsx',
    './layouts/**/*.jsx',
    './screens/**/*.jsx'
  ],
  theme: {
    extend: {
      height: {
        '100': '400px',
        '112': '448px',
        '125': '500px',
        '150': '600px',
        '175': '700px'
      },
      inset: {
        '1/20': '5%',
        '1/10': '10%',
        '3/20': '15%',
        '3/10': '30%',
        '9/20': '45%',
        '11/20': '55%',
        '13/20': '65%',
        '17/20': '85%',
        '9/10': '90%',
        '19/20': '95%'
      },
      screens: {
        'mini': '320px',
        'pocket': '360px',
        'xxs': '412px',
        'xs': '480px',
        'xxl': '1536px'
      },
      width: {
        '68': '272px',
        '100': '400px',
        '112': '448px',
        '125': '500px',
        '150': '600px'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        'flex-centered': {
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        },
        '.appt-category-100': {
          '@apply bg-sky-100 text-center text-sm font-extrabold border border-gray-300': ''
        },
        '.appt-category-200': {
          '@apply bg-sky-200 text-center text-sm font-extrabold border border-gray-300': ''
        },
        '.profile-category': {
          '@apply text-right text-gray-700 text-base font-extrabold': ''
        },
        '.profile-info': {
          '@apply text-gray-700 text-xs sm:text-sm font-bold': ''
        },
        '.profile-button': {
          '@apply text-blue-600 text-xs font-bold': ''
        }
      })
    })
  ]
}