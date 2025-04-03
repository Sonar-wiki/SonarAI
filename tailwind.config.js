/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1bf9a2',
          DEFAULT: '#1bf9a2',
          dark: '#0f7f5c',
        },
        secondary: {
          light: '#16a0fd',
          DEFAULT: '#16a0fd',
          dark: '#0acdf6',
        },
        dark: {
          light: '#2d3748',
          DEFAULT: '#1a202c',
          dark: '#030516',
        }
      },
    },
  },
  plugins: [],
} 