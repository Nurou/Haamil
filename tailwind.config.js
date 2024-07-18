/** @type {import('tailwindcss').Config} */

let safelist = [];
for (let i = 0; i < 604; i++) {
  safelist.push(`font-[page${i}]`);
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist,
  theme: {
    extend: {},
  },
  plugins: [],
};
