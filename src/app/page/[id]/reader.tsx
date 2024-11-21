import { PageLines } from './page-lines';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queries';
import { supabaseClient } from '@/supabase/client';
import { Verse } from '@quranjs/api';
import { Dictionary } from 'lodash';
import { SessionContextProvider } from '@/supabase/helpers';
import { Menu } from '@/components/menu';

function getInitialSession() {
  let initialSession = null;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('supabase.session');
      initialSession = stored ? JSON.parse(stored) : null;
      return initialSession;
    } catch (e) {
      console.warn('Error reading initial session:', e);
    }
  }
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen border-2 border-red-500">
      <main className="flex-grow flex items-center justify-center">{children}</main>
      <Menu />
    </div>
  );
}

export default function Reader({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
  const initialSession = getInitialSession();
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <PageLines versesByChapter={versesByChapter} />
        </Layout>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
