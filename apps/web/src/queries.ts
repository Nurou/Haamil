import { type ChapterId, type Verse, quran } from '@quranjs/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';

import { toCamelCase } from './lib/utils';
import { BASE_URL_QDC_CDN } from './shared/constants';

export const queryClient = new QueryClient();

export const getVersesByPage = async (pageNumber: string): Promise<Verse[]> => {
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

  const res = await fetch(`${BASE_URL_QDC_CDN}/verses/by_page/${pageNumber}?${queryString}`);

  if (!res.ok) {
    throw new Error('Failed to fetch verses by page.');
  }

  const data = await res.json();

  return toCamelCase(data.verses); // TODO: remove when SDK in use
};

export const versesByPageQueryOptions = (pageNumber = '1') =>
  queryOptions({
    queryKey: ['verses', pageNumber],
    queryFn: () => getVersesByPage(pageNumber),
    enabled: !!pageNumber,
    staleTime: Number.POSITIVE_INFINITY,
    // OLD SDK CODE — do not remove
    // queryFn: () =>
    //   quran.v4.verses.findByPage(pageNumber as PageNumber, {
    //     words: true,
    //     fields: {
    //       chapterId: true,
    //     },
    //     wordFields: {
    //       codeV2: true,
    //     },
    //   }),
    // staleTime: Infinity,
  });

export const chapterByIdQueryOptions = (id?: string) =>
  queryOptions({
    queryKey: ['chapter', id],
    queryFn: () => quran.v4.chapters.findById(id as ChapterId),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!id,
  });

export const partsQueryOptions = () =>
  queryOptions({
    queryKey: ['parts'],
    queryFn: () => quran.v4.juzs.findAll(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const chaptersQueryOptions = () =>
  queryOptions({
    queryKey: ['chapters'],
    queryFn: () => quran.v4.chapters.findAll(),
    staleTime: Number.POSITIVE_INFINITY,
  });
