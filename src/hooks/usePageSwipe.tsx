import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { SwipeEventData, useSwipeable } from 'react-swipeable';

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

  const prevPage = (parseInt(pageNumber) - 1).toString();
  const nextPage = (parseInt(pageNumber) + 1).toString();

  if (userSwipedLeft) {
    navigate(`/${prevPage}`);
  }
  if (userSwipedRight) {
    navigate(`/${nextPage}`);
  }
}

export const usePageSwipe = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();

  const handlers = useSwipeable({
    onSwiped: (eventData) =>
      changePage({
        eventData,
        navigate,
        pageNumber: pageNumber as string,
      }),
    onTap: (eventData) => {
      console.log('User Tapped!', eventData);
      // TODO: implement menu highlight/open in response to a tap
    },
  });

  return handlers;
};
