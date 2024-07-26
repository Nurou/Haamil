import { useParams } from 'react-router-dom';
import { Verse } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import { cn } from './lib/utils';
import { Dictionary, groupBy } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { usePrefetchAdjacentPagesData } from './hooks/usePrefetchAdjacentPagesData';
import './fonts.css';
import './index.css';
import { versesByPageQueryOptions } from './queries';
import { Separator } from './components/ui/separator';

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
      <div key={chapterId} className={cn('grid gap-2', 'text-xl sm:text-2xl md:text-3xl lg:text-4xl')}>
        {displayBasmalah && (
          <div>
            <Separator className='my-6' />
            <Basmalah />
          </div>
        )}
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
    <div className='grid place-items-center whitespace-nowrap'>
      <Helmet>
        <title>Haamil — Page {pageNumber}</title>
      </Helmet>
      <div className={cn(`font-[page${pageNumber}]`)}>
        <PageLines versesByChapter={versesByChapter} pageNumber={pageNumber} />
      </div>
      <span className='block mt-16'>{pageNumber}</span>
    </div>
  );
}

export default Page;
