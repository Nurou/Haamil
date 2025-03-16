import { Menu } from "@/web/components/menu";
import { queryClient } from "@/web/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	PageReaderContextProvider,
	type PageReaderContextType,
} from "../../../hooks/use-page-reader-context";
import { PageReaderLines } from "./page-lines";

function PageReaderLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<main className="flex-grow flex items-center justify-center">
				{children}
			</main>
			<Menu />
		</div>
	);
}

export default function PageReader(pageRenderData: PageReaderContextType) {
	return (
		<QueryClientProvider client={queryClient}>
			<PageReaderContextProvider value={pageRenderData}>
				<PageReaderLayout>
					<PageReaderLines />
				</PageReaderLayout>
			</PageReaderContextProvider>
		</QueryClientProvider>
	);
}
