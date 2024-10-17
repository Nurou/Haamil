import { createEmptyCard, fsrs, generatorParameters, Rating, Card, RecordLog } from 'ts-fsrs';
import { supabaseClient } from './supabase-client';

const params = generatorParameters({ enable_fuzz: true });
export const f = fsrs(params);

export async function getOrCreateCard(userId: string, pageNumber: string): Promise<Card> {
  const { data, error } = await supabaseClient
    .from('card')
    .select('*')
    .eq('user_id', userId)
    .eq('page_number', pageNumber)
    .single();

  if (error || !data) {
    const newCard = createEmptyCard();
    await upsertCard(userId, pageNumber, newCard);
    return newCard;
  }

  return data.card as Card;
}

export async function upsertCard(userId: string, pageNumber: string, card: Card): Promise<void> {
  const { error } = await supabaseClient
    .from('card')
    .upsert({ user_id: userId, page_number: pageNumber, card: card }, { onConflict: 'user_id, page_number' });

  if (error) {
    console.error('Error saving card:', error);
  }
}

/**
 * Handles the rating of a card and returns the updated card.
 *
 * This function takes a card and a rating, then uses the FSRS algorithm
 * to calculate the next review schedule for the card. Here's what it does:
 *
 * 1. It gets the current date and time.
 * 2. It uses the FSRS algorithm (via the 'f.repeat' function) to generate
 *    new scheduling information for the card based on the current time.
 * 3. It then selects the appropriate scheduling information based on the
 *    given rating and returns the updated card.
 *
 * @param card - The card being rated
 * @param rating - The rating given to the card
 * @returns The updated card with new scheduling information
 */
export function handleRate(card: Card, rating: Rating): Card {
  const now = new Date();
  const scheduling_cards: RecordLog = f.repeat(card, now); // schedules the card
  return scheduling_cards[rating as keyof RecordLog].card;
}

export function getNextReviewDate(card: Card): string {
  const dueDate = new Date(card.due);
  return dueDate.toLocaleDateString();
}

export { Rating };

export type * from 'ts-fsrs';
