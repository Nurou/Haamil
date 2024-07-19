import { useParams } from 'react-router-dom';
import './fonts.css';
import './index.css';
import { Verse } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import { versesByPageQueryOptions } from './main';
import { useRef } from 'react';
import { cn } from './utils';
import { Dictionary, groupBy } from 'lodash';

function Basmalah() {
  const BASMALAH_UNICODE = '\ufdfd';
  return (
    <p dir='rtl' className='flex justify-center w-full'>
      <span>{BASMALAH_UNICODE}</span>
    </p>
  );
}

function ChapterLines({ verses }: { verses: Verse[] }) {
  const linesToWordsMap = groupBy(
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
    const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId) && hasFirstVerseOfChapter;

    return (
      <div className='grid gap-3'>
        <span dir='rtl' className='surahnames'>
          {chapterId}
        </span>
        {displayBasmalah && <Basmalah />}
        <ChapterLines key={chapterId} verses={chapterVerses} />
      </div>
    );
  });
}

function Page() {
  const { pageNumber } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  if (!pageNumber) return null;

  const { data: verses } = useQuery(versesByPageQueryOptions(pageNumber));

  if (!verses) {
    return null;
  }

  const versesByChapter = groupBy(verses, (verse) => verse.chapterId); // chapterId is always present

  // create a mapping of each surah to it's chapter info
  return (
    <div
      ref={containerRef}
      className={cn(
        `font-[page${pageNumber}]`,
        'grid place-items-center gap-8 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
      )}
    >
      <PageLines versesByChapter={versesByChapter} />
    </div>
  );
}

export default Page;
