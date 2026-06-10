/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      },
    },
  },
  plugins: [],
};
