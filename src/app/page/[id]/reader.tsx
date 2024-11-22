import { PageLines } from './page-lines';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queries';
import { supabaseClient } from '@/supabase/client';
import { SessionContextProvider } from '@/supabase/helpers';
import { Menu } from '@/components/menu';
import { ReaderContextProvider, ReaderContextType } from '../../../hooks/use-reader-context';

function getInitialSessionFromBrowserStorage() {
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

export default function Reader(readerContextData: ReaderContextType) {
  const initialSession = getInitialSessionFromBrowserStorage();
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <QueryClientProvider client={queryClient}>
        <ReaderContextProvider value={readerContextData}>
          <Layout>
            <PageLines />
          </Layout>
        </ReaderContextProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
