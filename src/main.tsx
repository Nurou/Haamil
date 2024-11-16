import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './page.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout.tsx';
import {
  chaptersQueryOptions,
  partsQueryOptions,
  queryClient,
  versesByPageQueryOptions,
} from './queries.ts';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseClient } from './lib/supabase-client.ts';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: (
      <div className="grid place-content-center h-screen">
        <Auth
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          supabaseClient={supabaseClient}
          redirectTo={window.location.origin}
        />
      </div>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/1" replace />,
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
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
