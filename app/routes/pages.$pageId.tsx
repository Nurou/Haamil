import { PageNumber, quran, Verse } from '@quranjs/api';
import { json, useLoaderData } from '@remix-run/react';
import _, { Dictionary } from 'lodash';
import { cn } from '../utils';
import { useRef } from 'react';

function getVersesByPage(pageNumber: string) {
  return quran.v4.verses.findByPage(pageNumber as PageNumber, {
    words: true,
    fields: {
      chapterId: true,
    },
    wordFields: {
      codeV2: true,
    },
  });
}

export const loader = async ({ params }: any) => {
  const versesByPage = await getVersesByPage(params.pageId);
  return json(
    { versesByPage, pageId: params.pageId },
    {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
};

function Basmalah() {
  const BASMALAH_UNICODE = '\ufdfd';
  return (
    <p dir='rtl' className='flex justify-center w-full'>
      <span>{BASMALAH_UNICODE}</span>
    </p>
  );
}

function ChapterLines({ verses }: { verses: Verse[] }) {
  const linesToWordsMap = _.groupBy(
    verses.flatMap((v) => v.words),
    (word) => word?.lineNumber as number
  );

  return Object.keys(linesToWordsMap).map((lineNumber) => {
    const words = linesToWordsMap[lineNumber];
    return (
      <p dir='rtl' key={lineNumber} className='flex justify-center w-full'>
        {words.map((word) => {
          return <span key={word?.id}>{word?.codeV2}</span>;
        })}
      </p>
    );
  });
}

const CHAPTERS_WITH_NO_BASMALAH = ['1', '9'];

function PageLines({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
  const chapterIds = Object.keys(versesByChapter);

  return chapterIds.map((chapterId) => {
    const chapterVerses = versesByChapter[chapterId];
    const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
    const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId) && hasFirstVerseOfChapter; // TODO: use the `basmalah` field from chapter

    return (
      <div key={chapterId} className='grid gap-3 '>
        <span dir='rtl' className='surahnames'>
          {chapterId}
        </span>
        {displayBasmalah && <Basmalah />}
        <ChapterLines key={chapterId} verses={chapterVerses} />
      </div>
    );
  });
}

export default function Page() {
  const { versesByPage, pageId } = useLoaderData<typeof loader>();
  const containerRef = useRef<HTMLDivElement>(null);

  const versesByChapter = _.groupBy(versesByPage, (verse) => verse.chapterId); // chapterId is always present
  return (
    <div
      ref={containerRef}
      className={cn(
        `font-[page${pageId}]`,
        'grid place-items-center gap-8 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
      )}
    >
      <PageLines versesByChapter={versesByChapter} />
    </div>
  );
}
