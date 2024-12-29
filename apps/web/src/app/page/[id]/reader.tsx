import { Menu } from "@/web/components/menu";
import { queryClient } from "@/web/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	ReaderContextProvider,
	type ReaderContextType,
} from "../../../hooks/use-reader-context";
import { PageLines } from "./page-lines";

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<main className="flex-grow flex items-center justify-center">
				{children}
			</main>
			<Menu />
		</div>
	);
}

export default function Reader(readerContextData: ReaderContextType) {
	return (
		<QueryClientProvider client={queryClient}>
			<ReaderContextProvider value={readerContextData}>
				<Layout>
					<PageLines />
				</Layout>
			</ReaderContextProvider>
		</QueryClientProvider>
	);
}
