import { useParams } from 'react-router-dom';
import './fonts.css';
import './index.css';
import { Verse } from '@quranjs/api';
import { useQuery } from '@tanstack/react-query';
import { versesQueryOptions } from './main';
import { useRef } from 'react';
import { cn } from './utils';

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
          return <span key={word?.id}>{word?.codeV2}</span>;
        })}
      </p>
    );
  });
}

function Page() {
  const { pageNumber } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  if (!pageNumber) return null;

  const { data: verses } = useQuery(versesQueryOptions(pageNumber));

  if (!verses) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        `font-[page${pageNumber}]`,
        'grid place-items-center gap-2 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0'
      )}
    >
      {renderLines(verses)}
    </div>
  );
}

export default Page;
