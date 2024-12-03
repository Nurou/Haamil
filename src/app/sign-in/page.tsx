"use client";

import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/supabase/client";
import { useState } from "react";

export default function SignIn() {
	const [error, setError] = useState<string | null>(null);

	const handleGoogleSignIn = async () => {
		if (!supabaseClient) {
			setError("Supabase client not found");
			return;
		}
		const { error } = await supabaseClient.auth.signInWithOAuth({
			provider: "google",
			options: {
				// skipBrowserRedirect: true,
				redirectTo: window.location.origin,
			},
		});
		if (error) {
			setError(error.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

				<div className="mt-4">
					<Button
						onClick={handleGoogleSignIn}
						variant="outline"
						className="w-full"
					>
						Sign in with Google
					</Button>
				</div>
				{error && <p className="mt-4 text-red-500 text-center">{error}</p>}
			</div>
		</div>
	);
}
