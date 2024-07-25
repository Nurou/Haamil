import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './page.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { quran, ChapterId, Verse } from '@quranjs/api';
import { QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import _ from 'lodash';
import { Layout } from './components/layout.tsx';

const queryClient = new QueryClient();

const BASE_URL_CDN = 'https://api.qurancdn.com/api/qdc'; // should probably not be used. Use V4 SDK when https://github.com/quran/quran.com-api/issues/677 is resolved

async function getVersesByPage(pageNumber?: string): Promise<Verse[]> {
  if (!pageNumber) return;

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

  if (!res.ok) {
    throw new Error('Failed to fetch verses by page.');
  }

  const data = await res.json();

  return toCamelCase(data.verses); // TODO: remove when SDK in use
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = _.camelCase(key);
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);
  }
  return obj;
}

export const versesByPageQueryOptions = (pageNumber = '1') =>
  queryOptions({
    queryKey: ['verses', pageNumber],
    queryFn: () => getVersesByPage(pageNumber),
    enabled: !!pageNumber,
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/1' replace />,
  },
  {
    path: '/:pageNumber',
    element: (
      <Layout>
        <Page />
      </Layout>
    ),
    loader: async ({ params }) => {
      if (!params.pageNumber) return;

      await queryClient.prefetchQuery(versesByPageQueryOptions(params.pageNumber));

      const parts = await queryClient.fetchQuery(partsQueryOptions());
      const chapters = await queryClient.fetchQuery(chaptersQueryOptions());

      // TODO: add font to document before rendering page

      return { parts, chapters };
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
