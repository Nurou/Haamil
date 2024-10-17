import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { SwipeEventData, useSwipeable } from 'react-swipeable';

const LOWER_BOUND = 1;
const UPPER_BOUND = 604;

async function changePage({
  eventData,
  navigate,
  pageNumber,
}: {
  eventData: SwipeEventData;
  navigate: NavigateFunction;
  pageNumber: string;
}) {
  if (!pageNumber) return;

  const direction = eventData.dir;

  const userSwipedLeft = direction === 'Left';
  const userSwipedRight = direction === 'Right';

  const isOutOfBoundsLeft = parseInt(pageNumber) === LOWER_BOUND;
  const isOutOfBoundsRight = parseInt(pageNumber) === UPPER_BOUND;

  const prevPage = (parseInt(pageNumber) - 1).toString();
  const nextPage = (parseInt(pageNumber) + 1).toString();

  if (userSwipedLeft && !isOutOfBoundsLeft) {
    navigate(`/${prevPage}`);
  }
  if (userSwipedRight && !isOutOfBoundsRight) {
    navigate(`/${nextPage}`);
  }
}

export const usePageSwipe = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (!pageNumber) return;

      changePage({
        eventData,
        navigate,
        pageNumber,
      });
    },
    onTap: (eventData) => {
      console.log('User Tapped!', eventData);
      // TODO: implement menu highlight/open in response to a tap
    },
  });

  return handlers;
};
