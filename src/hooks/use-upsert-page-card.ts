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
        .from('cards')
        .upsert({ user_id: userId, page_number: pageNumber, ...card })
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
}
