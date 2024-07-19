import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './Page.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { quran, ChapterId } from '@quranjs/api';
import { QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import _ from 'lodash';

const queryClient = new QueryClient();

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

export const versesByPageQueryOptions = (pageNumber: string) =>
  queryOptions({
    queryKey: ['verses', pageNumber],
    queryFn: () => getVersesByPage(pageNumber),
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/1' replace />,
  },
  {
    path: '/:pageNumber',
    element: <Page />,
    loader: async ({ params }) => {
      if (!params.pageNumber) return;

      await queryClient.prefetchQuery(versesByPageQueryOptions(params.pageNumber));

      return null;
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
