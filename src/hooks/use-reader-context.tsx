import { Chapter, Verse, Juz } from '@quranjs/api';
import { Dictionary } from 'lodash';
import { createContext, useContext } from 'react';

const initialState: {
  parts: Juz[];
  chapters: Chapter[];
  versesByChapter: Dictionary<Verse[]>;
} = {
  parts: [],
  chapters: [],
  versesByChapter: {},
} as const;

export type ReaderContextType = typeof initialState;

const ReaderContext = createContext<ReaderContextType>(initialState);

export const useReaderContext = () => {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error(`useReaderContext must be used within a ReaderContextProvider.`);
  }

  return context;
};

export const ReaderContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ReaderContextType;
}) => {
  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};
