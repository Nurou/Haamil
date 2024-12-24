import {
	type Card,
	Rating,
	type RecordLog,
	fsrs,
	generatorParameters,
} from "ts-fsrs";

const params = generatorParameters({ enable_fuzz: true });
export const f = fsrs(params);

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
export function rateCard(card: Card, rating: Rating): Card {
	const now = new Date();
	const recordLog: RecordLog = f.repeat(card, now); // schedules the card
	return recordLog[rating as keyof RecordLog].card;
}

export function getNextReviewDate(card: Card): string {
	const dueDate = new Date(card.due);
	return dueDate.toLocaleDateString();
}

export { Rating };

export type * from "ts-fsrs";
