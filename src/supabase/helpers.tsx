import type { AuthError, Session, SupabaseClient } from "@supabase/supabase-js";
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";

type State = {
	isLoading: boolean;
	session: Session | null;
	error: AuthError | null;
	supabaseClient: SupabaseClient | null;
};

type Action =
	| { type: "INIT_SESSION"; payload: Session | null }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: AuthError | null };

const initialState: State = {
	isLoading: true,
	session: null,
	error: null,
	supabaseClient: null,
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "INIT_SESSION":
			return {
				...state,
				session: action.payload,
				isLoading: false,
				error: null,
			};
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, isLoading: false };
		default:
			return state;
	}
};

const SessionContext = createContext<State>(initialState);

export interface SessionContextProviderProps {
	supabaseClient: SupabaseClient | null;
	initialSession?: Session | null;
}

const STORAGE_KEY = "supabase.session";

export const SessionContextProvider = ({
	supabaseClient,
	initialSession = null,
	children,
}: PropsWithChildren<SessionContextProviderProps>) => {
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		session: initialSession,
		isLoading: !initialSession,
	});

	const updateSession = (newSession: Session | null) => {
		dispatch({ type: "INIT_SESSION", payload: newSession });
		if (newSession) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	};
	useEffect(() => {
		if (typeof window === "undefined") return;

		let isMounted = true;

		async function fetchSession() {
			if (!supabaseClient) return;
			try {
				const { data, error } = await supabaseClient.auth.getSession();
				if (isMounted) {
					if (error) {
						dispatch({ type: "SET_ERROR", payload: error });
					} else {
						updateSession(data.session);
					}
				}
			} catch (err) {
				if (isMounted) {
					dispatch({ type: "SET_ERROR", payload: err as AuthError });
				}
			}
		}

		fetchSession();

		return () => {
			isMounted = false;
		};
	}, [supabaseClient]);

	useEffect(() => {
		if (!supabaseClient) return;
		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange((event, session) => {
			if (
				session &&
				["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED"].includes(event)
			) {
				updateSession(session);
			} else if (event === "SIGNED_OUT") {
				updateSession(null);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabaseClient]);

	const value: State = useMemo(() => {
		const { isLoading, session, error } = state;

		if (isLoading) {
			return { isLoading: true, session: null, error: null, supabaseClient };
		}

		if (error) {
			return { isLoading: false, session: null, error, supabaseClient };
		}

		return { isLoading: false, session, error: null, supabaseClient };
	}, [state, supabaseClient]);

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
};

export const useSessionContext = () => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error(
			`useSessionContext must be used within a SessionContextProvider.`,
		);
	}

	return context;
};

export function useSupabaseClient<
	Database = unknown,
	SchemaName extends string & keyof Database = "public" extends keyof Database
		? "public"
		: string & keyof Database,
>() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error(
			`useSupabaseClient must be used within a SessionContextProvider.`,
		);
	}

	return context.supabaseClient as SupabaseClient<Database, SchemaName>;
}

export const useSession = () => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error(`useSession must be used within a SessionContextProvider.`);
	}

	return context.session;
};

export const useUser = () => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within a SessionContextProvider.`);
	}

	return context.session?.user ?? null;
};
