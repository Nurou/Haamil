import { useEffect, useState } from 'react';
import './fonts.css';
import './index.css';
import { quran, Verse } from '@quranjs/api';

type KeyFunction<T> = (item: T) => string | number;

function groupBy<T>(array: T[], key: KeyFunction<T>): Record<string | number, T[]> {
  return array.reduce((result, currentItem) => {
    const groupKey = key(currentItem);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string | number, T[]>);
}

function renderLines(verses: Verse[]) {
  const lines = groupBy(
    verses.flatMap((v) => v.words),
    (word) => word?.lineNumber as number
  );

  return Object.keys(lines).map((lineNumber) => {
    const words = lines[lineNumber];
    return (
      <p dir='rtl' key={lineNumber} className='flex justify-center w-full'>
        {words.map((word) => {
          return (
            <span key={word?.codeV2} style={{}}>
              {word?.codeV2}
            </span>
          );
        })}
      </p>
    );
  });
}

function App() {
  const [verses, setVerses] = useState<Verse[] | null>(null);

  useEffect(() => {
    quran.v4.verses
      .findByPage(1, {
        words: true,
        wordFields: {
          codeV2: true,
        },
      })
      .then((verses) => {
        setVerses(verses);
      });
  }, []);

  if (!verses) {
    return <div>Loading...</div>;
  }

  return (
    <div className='grid place-items-center gap-2 font-[page1] text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'>
      {renderLines(verses)}
    </div>
  );
}

export default App;
