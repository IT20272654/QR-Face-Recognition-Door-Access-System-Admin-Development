/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Use 'media' for system preference
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        BgBlue: '#393a51', // You can name it anything you like
    },
  },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}