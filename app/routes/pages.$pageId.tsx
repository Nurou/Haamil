import { PageNumber, quran, Verse, Word } from '@quranjs/api';
import { json, useLoaderData } from '@remix-run/react';
import _, { Dictionary } from 'lodash';
import { cn } from '../utils';

const BASE_URL_CDN = 'https://api.qurancdn.com/api/qdc'; // should probably not be used. Use V4 SDK when https://github.com/quran/quran.com-api/issues/677 is resolved

async function getVersesByPage(pageNumber: string) {
  const params = {
    words: 'true',
    per_page: 'all',
    fields: 'text_uthmani,chapter_id,hizb_number,text_imlaei_simple',
    reciter: '7',
    word_translation_language: 'en',
    word_fields: 'line_number,verse_key,verse_id,page_number,location,text_uthmani,code_v2,qpc_uthmani_hafs',
    mushaf: '1',
    filter_page_words: 'true',
  };

  const queryString = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE_URL_CDN}/verses/by_page/${pageNumber}?${queryString}`);
  const data = await res.json();

  return toCamelCase(data.verses); // TODO: remove when SDK in use

  // OLD SDK CODE — do not remove
  // return quran.v4.verses.findByPage(pageNumber as PageNumber, {
  //   words: true,
  //   perPage: 1,
  //   fields: {
  //     chapterId: true,
  //   },
  //   wordFields: {
  //     codeV2: true,
  //     v2Page: true,
  //     textUthmani: true,
  //   },
  // });
}

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = _.camelCase(key);
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
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
      <div
        key={chapterId}
        className='grid gap-3 sm:gap-5 text-[clamp(0.75rem,0.75rem+0.5vw+0.5vh,3rem)] whitespace-nowrap'
      >
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

  const versesByChapter = _.groupBy(versesByPage, (verse) => verse.chapterId);
  return (
    <div
      className={cn(
        `font-[page${pageId}]`,
        'grid place-items-center gap-8 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
      )}
    >
      <PageLines versesByChapter={versesByChapter} />
    </div>
  );
}
