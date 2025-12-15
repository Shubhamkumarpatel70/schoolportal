/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3C5D',
          50: '#E6EDF3',
          100: '#CCDBE7',
          200: '#99B7CF',
          300: '#6693B7',
          400: '#336F9F',
          500: '#0B3C5D',
          600: '#09304A',
          700: '#072438',
          800: '#051825',
          900: '#030C13',
        },
        secondary: {
          DEFAULT: '#328CC1',
          50: '#E6F2F8',
          100: '#CCE5F1',
          200: '#99CBE3',
          300: '#66B1D5',
          400: '#3397C7',
          500: '#328CC1',
          600: '#28709A',
          700: '#1E5474',
          800: '#14384D',
          900: '#0A1C27',
        },
        accent: {
          DEFAULT: '#D9B310',
          50: '#FBF6E6',
          100: '#F7EDCC',
          200: '#EFDB99',
          300: '#E7C966',
          400: '#DFB733',
          500: '#D9B310',
          600: '#AE8F0D',
          700: '#826B0A',
          800: '#574706',
          900: '#2B2403',
        },
        neutral: {
          1: '#FFFFFF',
          2: '#FFFFFF',
          3: '#2E2E2E',
        },
      },
    },
  },
  plugins: [],
}

