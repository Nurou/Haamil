import { GetStaticPaths } from 'next';

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export default function Page() {
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}
