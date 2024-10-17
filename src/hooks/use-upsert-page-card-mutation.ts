import { useMutation } from '@tanstack/react-query';
import { supabaseClient } from '../lib/supabase-client';
import { Card } from 'ts-fsrs';

interface Params {
  userId: string;
  pageNumber: string;
  card: Card;
}

export function useUpsertPageCardMutation() {
  return useMutation({
    mutationFn: async (args: Params) => {
      const { userId, pageNumber, card } = args;

      const { data, error } = await supabaseClient
        .from('card')
        .upsert(
          { user_id: userId, page_number: pageNumber, card: card },
          {
            onConflict: 'user_id, page_number',
          }
        )
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
