import { useQuery } from '@tanstack/react-query';
import { getOrCreateCard } from '../lib/fsrs';
import { useUser } from '@supabase/auth-helpers-react';

export function useGetPageCard(pageNumber: string | undefined) {
  const user = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: ['card', userId, pageNumber],
    queryFn: async () => {
      if (!userId || !pageNumber) return null;
      return await getOrCreateCard(userId, pageNumber);
    },
    enabled: !!userId && !!pageNumber,
  });
}
