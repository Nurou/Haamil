import { useParams } from 'react-router-dom';
import { Verse } from '@quranjs/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from './lib/utils';
import { Dictionary, groupBy } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { usePrefetchAdjacentPagesData } from './hooks/use-prefetch-adjacent-pages-data';
import { useUpsertPageCardMutation } from './hooks/use-upsert-page-card-mutation';
import './fonts.css';
import './index.css';
import { chaptersQueryOptions, versesByPageQueryOptions } from './queries';
import { Separator } from './components/ui/separator';
import { Button } from '@/components/ui/button';
import { getNextReviewDate, rateCard, Rating } from './lib/fsrs';
import { useGetOrCreatePageCard } from './hooks/use-get-or-create-page-card';
import { useState } from 'react';
import { useUser } from './supabase/helpers';

const CHAPTERS_WITH_NO_BASMALAH = ['1', '9'];
const UNICODE_SURAH = '\uE000';
const BASMALAH_UNICODE = '\ufdfd';

function Basmalah() {
  return (
    <p dir="rtl" className="flex justify-center w-full mb-2">
      <span>{BASMALAH_UNICODE}</span>
    </p>
  );
}

/**
 * maps to a glyph in the woff2 font file
 * e.g. chapter 1 --> E001
 *  */
function getChapterNameUnicode(chapterId: string) {
  return `${chapterId.padStart(3, '0')}${UNICODE_SURAH}`;
}

function ChapterLines({ verses }: { verses: Verse[] }) {
  const linesToWordsMap = groupBy(
    verses.flatMap((v) => v.words),
    (word) => word?.lineNumber as number
  );

  return Object.keys(linesToWordsMap).map((lineNumber) => {
    const words = linesToWordsMap[lineNumber];
    return (
      <p dir="rtl" key={lineNumber} className="flex justify-center w-full">
        {words.map((word) => {
          return <span key={word?.id}>{word?.codeV2}</span>;
        })}
      </p>
    );
  });
}

function PageLines({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
  const chapterIds = Object.keys(versesByChapter);

  return chapterIds.map((chapterId) => {
    const chapterVerses = versesByChapter[chapterId];
    const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
    const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId);

    const moreThanOneChapterOnPage = chapterIds.length > 1;
    const chapterNameUnicode = getChapterNameUnicode(chapterId);

    return (
      <div
        key={chapterId}
        className={cn('grid gap-2', 'text-xl sm:text-2xl md:text-3xl lg:text-4xl')}
      >
        {hasFirstVerseOfChapter ? (
          <div>
            {moreThanOneChapterOnPage && <Separator className="my-6" />}
            <span dir="rtl" className="font-[surah-names] block text-center mb-4 bg-slate-100">
              {chapterNameUnicode}
            </span>
            {displayBasmalah && <Basmalah />}
          </div>
        ) : null}
        <ChapterLines key={chapterId} verses={chapterVerses} />
      </div>
    );
  });
}

function Page() {
  const { pageNumber } = useParams();
  const user = useUser();
  const queryClient = useQueryClient();

  const { data: versesByPage } = useQuery(versesByPageQueryOptions(pageNumber));
  const { data: chapters } = useQuery(chaptersQueryOptions());
  const { data: card } = useGetOrCreatePageCard(pageNumber);
  console.log('card', !!card);

  const [isMarkedForReview, setIsMarkedForReview] = useState(false);

  const upsertCardMutation = useUpsertPageCardMutation();

  usePrefetchAdjacentPagesData(pageNumber);

  const userId = user?.id;

  if (!versesByPage || !pageNumber || !chapters) {
    return null;
  }

  const versesByChapter = groupBy(versesByPage, (verse) => verse.chapterId);

  const onRate = async (rating: Rating) => {
    if (!userId || !pageNumber || !card) {
      throw new Error('Cannot rate the page. Missing user ID, page number, or card data');
    }
    const updatedCard = rateCard(card, rating);
    upsertCardMutation.mutate(
      { userId, pageNumber, card: updatedCard },
      {
        onSuccess: () => {
          // Invalidate and refetch the card query after successful mutation
          queryClient.invalidateQueries({ queryKey: ['card', userId, pageNumber] });
        },
      }
    );
  };

  const shouldDisplayRatingButtons = !!card && !!userId && isMarkedForReview;

  return (
    <div className="grid place-items-center whitespace-nowrap my-4">
      <Helmet>
        <title>Haamil — Page {pageNumber}</title>
      </Helmet>
      <div className={cn(`font-[page${pageNumber}]`)}>
        <PageLines versesByChapter={versesByChapter} />
      </div>
      <div className="flex flex-col items-center mt-16 space-y-2">
        <div className="flex justify-center space-x-2">
          {shouldDisplayRatingButtons ? (
            <>
              <Button
                variant="default"
                onClick={() => onRate(Rating.Again)}
                disabled={upsertCardMutation.isPending}
              >
                Again
              </Button>
              <Button
                variant="default"
                onClick={() => onRate(Rating.Hard)}
                disabled={upsertCardMutation.isPending}
              >
                Hard
              </Button>
              <Button
                variant="default"
                onClick={() => onRate(Rating.Good)}
                disabled={upsertCardMutation.isPending}
              >
                Good
              </Button>
              <Button
                variant="default"
                onClick={() => onRate(Rating.Easy)}
                disabled={upsertCardMutation.isPending}
              >
                Easy
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => setIsMarkedForReview(true)}>
              Enable review {/* TODO: replace with a toggle */}
            </Button>
          )}
        </div>
        {card ? (
          <p className="text-sm text-gray-600">Next review: {getNextReviewDate(card)}</p>
        ) : null}
        {upsertCardMutation.isError && (
          <p className="text-sm text-red-600">
            Error updating card: {upsertCardMutation.error.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Page;
