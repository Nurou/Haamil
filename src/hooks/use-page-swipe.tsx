import { useSwipeable } from 'react-swipeable';

export const usePageSwipe = ({
  onSwiped,
  currentPageNumber,
  lowerBound = 1,
  upperBound = 604,
}: {
  onSwiped: (page: string) => void;
  currentPageNumber: number;
  lowerBound?: number;
  upperBound?: number;
}) => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (!currentPageNumber) return;

      const { dir } = eventData;

      if (dir === 'Left' && currentPageNumber > lowerBound) {
        const prevPage = (currentPageNumber - 1).toString();
        onSwiped(prevPage);
      }

      if (dir === 'Right' && currentPageNumber < upperBound) {
        const nextPage = (currentPageNumber + 1).toString();
        onSwiped(nextPage);
      }
    },
  });

  return { handlers };
};
