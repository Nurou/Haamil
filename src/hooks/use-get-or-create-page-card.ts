import { useQuery } from '@tanstack/react-query';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@/lib/supabase-client';
import { Card, createEmptyCard } from 'ts-fsrs';

async function getOrCreatePageCard(userId: string, pageNumber: string): Promise<Card> {
  const { data, error } = await supabaseClient
    .from('card')
    .select('*')
    .eq('user_id', userId)
    .eq('page_number', pageNumber)
    .single();

  console.log(error);

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching card:', error);
    throw error;
  }

  if (data) return data.card as Card;

  const newCard = createEmptyCard();
  // upsert to ensure uniqueness
  await upsertCard(userId, pageNumber, newCard);
  return newCard;
}

async function upsertCard(userId: string, pageNumber: string, card: Card): Promise<void> {
  const { error } = await supabaseClient
    .from('card')
    .upsert(
      { user_id: userId, page_number: pageNumber, card: card },
      { onConflict: 'user_id, page_number' }
    );

  if (error) {
    console.error('Error saving card:', error);
  }
}

export function useGetOrCreatePageCard(pageNumber: string | undefined) {
  const user = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: ['card', userId, pageNumber],
    queryFn: async () => {
      if (!userId || !pageNumber) return null;
      return await getOrCreatePageCard(userId, pageNumber);
    },
    enabled: !!userId && !!pageNumber,
  });
}
