import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type TypedSupabaseClient = typeof supabaseClient;
