'use client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { PageLines } from './page-lines';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../queries';
import { supabaseClient } from '../../../lib/supabase-client';
import { Verse } from '@quranjs/api';
import { Dictionary } from 'lodash';

export function Reader({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <PageLines versesByChapter={versesByChapter} />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
