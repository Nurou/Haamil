const safelist = [];
const START_PAGE_IDX = 1;
const END_PAGE_IDX = 605;

for (let i = START_PAGE_IDX; i < END_PAGE_IDX; i++) {
  safelist.push(`font-[page${i}]`); // prevent tw from purging these classes
}

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  safelist,
  theme: {
    extend: {},
  },
  plugins: [],
};
