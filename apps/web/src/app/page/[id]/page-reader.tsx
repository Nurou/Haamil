import { Menu } from "@/web/components/menu";
import { cn } from "@/web/lib/utils";
import { queryClient } from "@/web/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import {
  PageReaderContextProvider,
  type PageReaderContextType,
} from "../../../hooks/use-page-reader-context";
import { PageReaderLines } from "./page-lines";

function PageReaderLayout({
  children,
  pageId,
}: PropsWithChildren<{ pageId: string }>) {
  return (
    <div
      className={cn(
        "flex flex-col h-screen max-w-screen-sm mx-auto",
        `font-[page${pageId}]`
      )}
    >
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
        <PageReaderLayout pageId={pageRenderData.pageId}>
          <PageReaderLines />
        </PageReaderLayout>
      </PageReaderContextProvider>
    </QueryClientProvider>
  );
}
