/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          dark: '#ffffff', // card background
          brown: '#f8f9fa', // main offwhite background
          light: '#212529', // text color
          accent: '#4f46e5', // indigo accent
          hover: '#4338ca', // indigo hover
          error: '#ef4444',
        }
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(33, 37, 41, 1)', 
        'retro-hover': '2px 2px 0px 0px rgba(33, 37, 41, 1)',
      }
    },
  },
  plugins: [],
}
