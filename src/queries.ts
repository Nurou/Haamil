import { ChapterId, quran, Verse } from '@quranjs/api';
import { QueryClient, queryOptions } from '@tanstack/react-query';

import { BASE_URL_QDC_CDN } from './constants';
import { toCamelCase } from './lib/utils';

export const queryClient = new QueryClient();

export const getVersesByPage = async (pageNumber: string): Promise<Verse[]> => {
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
    staleTime: Infinity,
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
    staleTime: Infinity,
    enabled: !!id,
  });

export const partsQueryOptions = () =>
  queryOptions({
    queryKey: ['parts'],
    queryFn: () => quran.v4.juzs.findAll(),
    staleTime: Infinity,
  });

export const chaptersQueryOptions = () =>
  queryOptions({
    queryKey: ['chapters'],
    queryFn: () => quran.v4.chapters.findAll(),
    staleTime: Infinity,
  });
