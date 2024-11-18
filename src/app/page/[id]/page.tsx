import '../../../fonts-hafs-v1.css';
import '../../../index.css';

import { groupBy } from 'lodash';

import { cn, toCamelCase } from '@/lib/utils';
import { BASE_URL_QDC_CDN } from '../../../constants';
import { PageLines } from './page-lines';

export function generateStaticParams() {
  // Generate paths for all 604 pages of the Quran
  const pages = Array.from({ length: 604 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return pages;
}

enum MushafToQueryParamCode {
  HAFS_V1 = '2',
  HAFS_V2 = '1',
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
        'line_number,verse_key,verse_id,page_number,location,text_uthmani,code_v2,code_v1,qpc_uthmani_hafs',
      mushaf: MushafToQueryParamCode.HAFS_V1,
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
