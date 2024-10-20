/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,html}",
  ],
  theme: {
    colors: {
      'black': '#191A18',
      'grey': '#5E615D',
      'green': '#B7D08E',
      'blue': '#98DAEA',
      'salmon': '#F2BD95',
      'purple': '#ACA8D7',
      'darkerPurple': '#716CA8',
      'offWhite': '#FDFCFA',
      'transWhite': '#FDFCFA[.5]'
    },
    fontFamily: {
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        'desert': "url('./assets/img/desert.png')",
        'beach': "url('./assets/img/beach.jpg')",
        'mountain': "url('./assets/img/mountain.jpg')",
        'score-img': "url('./assets/img/score.svg')"
      },
        dropShadow: {
          'trivia': '4px 4px 20px rgba(0, 0, 0, 0.25)',
      },
      fontSize: {
        'h1': ['3.125rem'],
        'h2': ['2.5rem'],
        'h3': ['1.5rem'],
        'p-sm': ['0.875rem'],
        'btn': ['1rem'],
        'icon': ['1.5rem']
      },
    },
  },
  plugins: [],
}