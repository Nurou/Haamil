import type { Chapter, Juz, Verse } from "@quranjs/api";
import type { Dictionary } from "lodash";
import { createContext, useContext } from "react";

const initialState: {
  parts: Juz[];
  chapters: Chapter[];
  versesByChapter: Dictionary<Verse[]>;
  pageId: string;
} = {
  parts: [],
  chapters: [],
  versesByChapter: {},
  pageId: "",
} as const;

export type PageReaderContextType = typeof initialState;

const PageReaderContext = createContext<PageReaderContextType>(initialState);

export const usePageReaderContext = () => {
  const context = useContext(PageReaderContext);
  if (context === undefined) {
    throw new Error(
      "usePageReaderContext must be used within a PageReaderContextProvider."
    );
  }

  return context;
};

export const PageReaderContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PageReaderContextType;
}) => {
  return (
    <PageReaderContext.Provider value={value}>
      {children}
    </PageReaderContext.Provider>
  );
};
