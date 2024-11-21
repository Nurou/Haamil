'use client';
import { Verse } from '@quranjs/api';
import { Dictionary } from 'lodash';
import dynamic from 'next/dynamic';

const Reader = dynamic(() => import('./reader'), { ssr: false }); // disable server-side rendering -> render as SPA

export default function ReaderSpa({ versesByChapter }: { versesByChapter: Dictionary<Verse[]> }) {
  return <Reader versesByChapter={versesByChapter} />;
}
