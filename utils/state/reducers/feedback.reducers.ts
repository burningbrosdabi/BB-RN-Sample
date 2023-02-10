import { feedbackOrderingList, OrderingInterface } from 'utils/data';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface FeedbackState {
  orderingType: OrderingInterface
}

const initialState = {
  orderingType: feedbackOrderingList[0],
};

const reducer = (state: FeedbackState = initialState, action: Action): FeedbackState => {
  switch (action.type) {
    case ActionType.SET_FEEDBACK_ORDERING:
      return {
        ...state,
        orderingType: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
