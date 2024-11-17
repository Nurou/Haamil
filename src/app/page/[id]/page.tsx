import '../../../index.css';
import '../../../fonts.css';

import { groupBy } from 'lodash';

import { cn, toCamelCase } from '@/lib/utils';
import { BASE_URL_QDC_CDN } from '../../../constants';
import { PageLines } from './page-lines';

// function PageLines({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
//   const chapterIds = Object.keys(versesByChapter);

//   return chapterIds.map((chapterId) => {
//     const chapterVerses = versesByChapter[chapterId];
//     const hasFirstVerseOfChapter = chapterVerses.some((verse) => verse.verseNumber === 1);
//     const displayBasmalah = !CHAPTERS_WITH_NO_BASMALAH.includes(chapterId);
//     const moreThanOneChapterOnPage = chapterIds.length > 1;
//     const chapterNameUnicode = getChapterNameUnicode(chapterId);

//     return (
//       <div
//         key={`${chapterId}-${chapterVerses.length}`}
//         className={cn('grid gap-2', 'text-xl sm:text-2xl md:text-3xl lg:text-4xl')}
//       >
//         {hasFirstVerseOfChapter ? (
//           <div>
//             {moreThanOneChapterOnPage && <Separator className="my-6" />}
//             <span dir="rtl" className="font-[surah-names] block text-center mb-4 bg-slate-100">
//               {chapterNameUnicode}
//             </span>
//             {displayBasmalah && <Basmalah />}
//           </div>
//         ) : null}
//         <ChapterLines verses={chapterVerses} />
//       </div>
//     );
//   });
// }

export function generateStaticParams() {
  // Generate paths for all 604 pages of the Quran
  const pages = Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return pages;
}

async function getVersesByPage(pageNumber: string) {
  try {
    const params = {
      words: 'true',
      per_page: 'all',
      fields: 'text_uthmani,chapter_id,hizb_number,text_imlaei_simple',
      reciter: '7',
      word_translation_language: 'en',
      word_fields:
        'line_number,verse_key,verse_id,page_number,location,text_uthmani,code_v2,qpc_uthmani_hafs',
      mushaf: '1',
      filter_page_words: 'true',
    };

    const queryString = new URLSearchParams(params).toString();

    const response = await fetch(`${BASE_URL_QDC_CDN}/verses/by_page/${pageNumber}?${queryString}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch page ${pageNumber}: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }

    const versesByPage = await response.json();
    // camel casing for parity with official API that returns camel case
    return toCamelCase(versesByPage.verses);
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    // Return empty array as fallback to prevent page from crashing
    return [];
  }
}

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const { id } = await props.params;

  const verses = await getVersesByPage(id);
  const versesByChapter = groupBy(verses, (verse) => verse.chapterId);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className={cn(`font-[page${id}]`)}>
        <PageLines versesByChapter={versesByChapter} />
      </div>
    </section>
  );
}
