import { ChapterId, PageNumber, quran } from '@quranjs/api';
import { json, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

function getChapters() {
  return quran.v4.chapters.findAll();
}

export const loader = async () => {
  const chapters = await getChapters();
  return json({ chapters });
};

export default function Index() {
  const { chapters } = useLoaderData<typeof loader>();
  return (
    <div className='font-sans p-4'>
      <ul className='list-disc mt-4 pl-6 space-y-2'>
        {chapters.map((chapter) => {
          const firstPageOfChapter = chapter.pages[0];
          return (
            <Link
              key={chapter.id}
              prefetch='intent'
              reloadDocument
              to={`/pages/${firstPageOfChapter}`}
              className='text-blue-700 underline visited:text-purple-900'
            >
              {chapter.nameSimple}
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
