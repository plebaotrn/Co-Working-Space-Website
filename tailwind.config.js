export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1C2541',
        'teal': '#5BC0BE',
        'off-white': '#FAFAFA',
        'slate': '#3A506B',
        'light-gray': '#F4F4F9',
        'primary': '#1C2541',
        'primary-dark': '#0F1729',
        'accent': '#5BC0BE',
        'accent-dark': '#4AA09D',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}