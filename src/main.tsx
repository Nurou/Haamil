import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './Page.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { quran, PageNumber } from '@quranjs/api';
import { QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const getQueryKeyVerses = (pageNumber: string) => ['verses', pageNumber];

export const versesQueryOptions = (pageNumber: string) =>
  queryOptions({
    queryKey: ['verses', pageNumber],
    queryFn: () =>
      quran.v4.verses.findByPage(pageNumber as PageNumber, {
        words: true,
        wordFields: {
          codeV2: true,
        },
      }),
    staleTime: Infinity,
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

      await queryClient.prefetchQuery(versesQueryOptions(params.pageNumber));

      return null;
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
