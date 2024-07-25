import { Chapter, Juz } from '@quranjs/api';
import { uniqBy } from 'lodash';
import partToFirstPage from '../../data/part-to-first-page-id.json';

const pagesCount = 604;

export const generateNavItems = ({ parts, chapters }: { parts: Juz[]; chapters: Chapter[] }) => {
  const uniqueParts = uniqBy(parts, 'juzNumber');

  return [
    {
      id: 'chapter',
      title: 'Chapter',
      children: chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.nameSimple,
        href: `/${chapter.pages[0]}`,
      })),
    },
    {
      id: 'part',
      title: 'Juz',
      children: uniqueParts.map((part) => {
        const partNumber = part.juzNumber.toString() as keyof typeof partToFirstPage;
        const firstPageOfPart = partToFirstPage[partNumber];

        return {
          id: part.id,
          title: `Juz ${part.juzNumber.toString()}`, //TODO: add start surah name and hizb + maybe ayah
          href: `/${firstPageOfPart}`,
        };
      }),
    },
    {
      id: 'page',
      title: 'Page',
      children: Array.from({ length: pagesCount }, (_, i) => ({
        id: i + 1,
        title: `Page ${i + 1}`,
        href: `/${i + 1}`,
      })),
    },
  ];
};
