import { useParams } from 'react-router-dom';
import { Verse } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import { versesByPageQueryOptions } from './main';
import { cn } from './utils';
import { Dictionary, groupBy } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { usePrefetchAdjacentPagesData } from './hooks/usePrefetchAdjacentPagesData';
import './fonts.css';
import './index.css';

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

function PageLines({ versesByChapter }: { versesByChapter: Dictionary<Verse[]>; pageNumber: string }) {
  const chapterIds = Object.keys(versesByChapter);

  return chapterIds.map((chapterId) => {
    const chapterVerses = versesByChapter[chapterId];
    const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
    const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId) && hasFirstVerseOfChapter;

    return (
      <div key={chapterId} className={cn('grid gap-2', 'sm:text-[1.5em] md:text-[2em]')}>
        {displayBasmalah && <Basmalah />}
        <ChapterLines key={chapterId} verses={chapterVerses} />
      </div>
    );
  });
}

function Page() {
  const { pageNumber } = useParams();

  const { data: versesByPage } = useQuery(versesByPageQueryOptions(pageNumber));

  usePrefetchAdjacentPagesData(pageNumber);

  if (!versesByPage || !pageNumber) {
    return null;
  }

  const versesByChapter = groupBy(versesByPage, (verse) => verse.chapterId); // chapterId is always present

  return (
    <div className='grid place-content-center whitespace-nowrap'>
      <Helmet>
        <title>Haamil — Page {pageNumber}</title>
      </Helmet>
      <div className={cn(`font-[page${pageNumber}]`)}>
        <PageLines versesByChapter={versesByChapter} pageNumber={pageNumber} />
      </div>
    </div>
  );
}

export default Page;
