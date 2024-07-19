import { usePrefetchQuery } from '@tanstack/react-query';
import { versesByPageQueryOptions } from '../main';
import { useEffect } from 'react';

const FIRST_PAGE = 1;
const LAST_PAGE = 604;

interface FontInfo {
  name: string;
  url: string;
}

function getFontsToAdd(prevPage: number, nextPage: number): FontInfo[] {
  // Create an array of font objects
  const fonts: FontInfo[] = [];
  const BASE_URL = '../assets/fahadcomplexv2imagesfont/';
  for (let i = prevPage; i <= nextPage; i++) {
    fonts.push({ name: `page${i}`, url: `${BASE_URL}/p${i}.woff2` });
  }
  return fonts;
}

export const usePrefetchAdjacentPagesData = (currentPageNumber: string) => {
  const [prevPage, nextPage] = [parseInt(currentPageNumber) - 1, parseInt(currentPageNumber) + 1].filter(
    (n) => n > FIRST_PAGE && n < LAST_PAGE
  );

  // Prefetch the data (verses) for previous and next pages.
  usePrefetchQuery(versesByPageQueryOptions(prevPage?.toString()));
  usePrefetchQuery(versesByPageQueryOptions(nextPage?.toString()));

  // Prefetch the fonts for the previous and next pages.
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = getFontsToAdd(prevPage, nextPage);
        const fontPromises = fonts.map((font) => new FontFace(font.name, `url(${font.url})`).load());

        await Promise.all(fontPromises).then((loadedFonts) => {
          loadedFonts.forEach((font) => {
            document.fonts.add(font);
          });
        });
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  return null;
};
