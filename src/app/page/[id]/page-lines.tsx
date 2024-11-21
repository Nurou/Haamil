import { Verse } from '@quranjs/api';
import { groupBy } from 'lodash';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { usePageSwipe } from '@/hooks/use-page-swipe';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useReaderContext } from './use-reader-context';

const CHAPTERS_WITH_NO_BASMALAH = ['1', '9'];
const UNICODE_SURAH = '\uE000';
const BASMALAH_UNICODE = '\ufdfd';

// Helper function for chapter name unicode
function getChapterNameUnicode(chapterId: string) {
  return `${chapterId.padStart(3, '0')}${UNICODE_SURAH}`;
}

function Basmalah() {
  return (
    <p dir="rtl" className="flex justify-center w-full mb-2">
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
      <p dir="rtl" key={`${lineNumber}-${words.length}`} className="flex justify-center w-full">
        {words.map((word) => {
          return <span key={`${word?.id}-${word?.lineNumber}`}>{word?.codeV1}</span>;
        })}
      </p>
    );
  });
}

function ChapterContent({
  chapterId,
  pageHasMultipleChapters,
}: {
  chapterId: string;
  pageHasMultipleChapters: boolean;
}) {
  const { versesByChapter } = useReaderContext();
  const chapterVerses = versesByChapter[chapterId];
  const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
  const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId);
  const chapterNameUnicode = getChapterNameUnicode(chapterId);

  return (
    <div
      key={`${chapterId}-${chapterVerses.length}`}
      className={cn('grid gap-2', 'text-xl sm:text-2xl md:text-3xl lg:text-4xl')}
    >
      {hasFirstVerseOfChapter ? (
        <div>
          {pageHasMultipleChapters && <Separator className="my-6" />}
          <span dir="rtl" className="font-[surah-names] block text-center mb-4 bg-slate-100">
            {chapterNameUnicode}
          </span>
          {displayBasmalah && <Basmalah />}
        </div>
      ) : null}
      <ChapterLines verses={chapterVerses} />
    </div>
  );
}

type Router = ReturnType<typeof useRouter>;

// Prefetch closest adjacent pages
function usePrefetchAdjacentPagesData(pageNumber: number, router: Router) {
  useEffect(() => {
    const prevPage = pageNumber - 1;
    const nextPage = pageNumber + 1;
    router.prefetch(`/page/${prevPage}`);
    router.prefetch(`/page/${nextPage}`);
  }, [pageNumber, router]);
}

export function PageLines() {
  const router = useRouter();
  const params = useParams();
  const pageNumber = parseInt(params.id as string);

  usePrefetchAdjacentPagesData(pageNumber, router);

  const { handlers: swipeableHandlers } = usePageSwipe({
    currentPageNumber: pageNumber,
    onSwiped: (id) => {
      router.push(`/page/${id}`);
    },
  });

  const { versesByChapter } = useReaderContext();

  const chapterIds = Object.keys(versesByChapter);
  const pageHasMultipleChapters = chapterIds.length > 1;

  return (
    <div {...swipeableHandlers} className="w-full">
      {chapterIds.map((chapterId) => {
        return (
          <ChapterContent
            key={chapterId}
            chapterId={chapterId}
            pageHasMultipleChapters={pageHasMultipleChapters}
          />
        );
      })}
    </div>
  );
}
