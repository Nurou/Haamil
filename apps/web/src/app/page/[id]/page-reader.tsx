import { Menu } from "@/web/components/menu";
import { queryClient } from "@/web/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  PageReaderContextProvider,
  type PageReaderContextType,
} from "../../../hooks/use-page-reader-context";
import { PageReaderLines } from "./page-lines";
import { useEffect, useState } from "react";

function PageReaderLayout({ children }: { children: React.ReactNode }) {
  console.log("PageReaderLayout");
  /* make a request to /api  */
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      <Menu />
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
