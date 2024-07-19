/** @type {import('tailwindcss').Config} */

let safelist = [];
for (let i = 1; i < 605; i++) {
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
