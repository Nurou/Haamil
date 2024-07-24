import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Verse } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import { versesByPageQueryOptions } from './main';
import { cn } from './utils';
import { Dictionary, groupBy } from 'lodash';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { Helmet } from 'react-helmet-async';
import { usePrefetchAdjacentPagesData } from './hooks/usePrefetchAdjacentPagesData';
import './fonts.css';
import './index.css';

async function changePage({
  eventData,
  navigate,
  pageNumber,
}: {
  eventData: SwipeEventData;
  navigate: NavigateFunction;
  pageNumber: string;
}) {
  if (!pageNumber) return;

  const direction = eventData.dir;

  const userSwipedLeft = direction === 'Left';
  const userSwipedRight = direction === 'Right';

  const prevPage = (parseInt(pageNumber) - 1).toString();
  const nextPage = (parseInt(pageNumber) + 1).toString();

  if (userSwipedLeft) {
    navigate(`/${prevPage}`);
  }
  if (userSwipedRight) {
    navigate(`/${nextPage}`);
  }
}

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

function PageLines({ versesByChapter, pageNumber }: { versesByChapter: Dictionary<Verse[]>; pageNumber: string }) {
  const chapterIds = Object.keys(versesByChapter);

  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwiped: (eventData) =>
      changePage({
        eventData,
        navigate,
        pageNumber,
      }),
    onTap: (eventData) => {
      console.log('User Tapped!', eventData);
      // TODO: implement menu highlight/open in response to a tap
    },
  });

  return chapterIds.map((chapterId) => {
    const chapterVerses = versesByChapter[chapterId];
    const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
    const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId) && hasFirstVerseOfChapter;

    return (
      <div {...handlers} key={chapterId} className={cn('grid gap-2', 'sm:text-[1.5em] md:text-[2em]')}>
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
    <div className='grid place-content-center h-screen whitespace-nowrap'>
      <Helmet>
        <title>Haamil — Page {pageNumber}</title>
      </Helmet>
      <div
        className={cn(
          `font-[page${pageNumber}]`
          // 'grid place-items-center gap-8 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
          // 'grid place-items-center gap-8 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
        )}
      >
        <PageLines versesByChapter={versesByChapter} pageNumber={pageNumber} />
      </div>
    </div>
  );
}

export default Page;
