import { Menu } from "@/web/components/menu";
import { cn } from "@/web/lib/utils";
import { PropsWithChildren } from "react";
import {
  PageReaderContextProvider,
  usePageReaderContext,
  type PageReaderContextType,
} from "../../../hooks/use-page-reader-context";
import { PageReaderLines } from "./page-lines";

function PageReaderLayout({ children }: PropsWithChildren) {
  const { pageId } = usePageReaderContext();
  return (
    <div className={cn("flex flex-col h-screen mx-auto")}>
      <main
        className={cn(
          "flex-grow flex items-center justify-center",
          `font-[page${pageId}]`
        )}
      >
        {children}
      </main>
      <Menu />
    </div>
  );
}

export default function PageReader(pageRenderData: PageReaderContextType) {
  return (
    <PageReaderContextProvider value={pageRenderData}>
      <PageReaderLayout>
        <PageReaderLines />
      </PageReaderLayout>
    </PageReaderContextProvider>
  );
}
