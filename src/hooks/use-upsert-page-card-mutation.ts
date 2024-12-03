import { supabaseClient } from "@/supabase/client";
import { useMutation } from "@tanstack/react-query";
import type { Card } from "ts-fsrs";

interface Params {
	userId: string;
	pageNumber: string;
	card: Card;
}

export function useUpsertPageCardMutation() {
	return useMutation({
		mutationFn: async (args: Params) => {
			const { userId, pageNumber, card } = args;

			if (!supabaseClient) return;

			const { data, error } = await supabaseClient
				.from("card")
				.upsert(
					{ user_id: userId, page_number: pageNumber, card: card },
					{
						onConflict: "user_id, page_number",
					},
				)
				.select();

			if (error) {
				throw new Error(error.message);
			}

			return data;
		},
	});
}
