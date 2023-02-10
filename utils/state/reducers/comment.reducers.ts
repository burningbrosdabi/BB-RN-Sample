import { CommentItemModel } from 'model';
import { getUniqueListBy } from 'utils/helper/OrderHelper';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface MagazineState {
  comments: CommentItemModel[],
  totalComments: number
}

const initialState = {
  comments: [],
  totalComments: 0
};

const reducer = (state: MagazineState = initialState, action: Action): MagazineState => {
  switch (action.type) {
    case ActionType.SET_TOTAL_COMMENTS:
      return {
        ...state,
        totalComments: action.payload ?? 0,
      };
    case ActionType.SET_COMMENTS:
      return {
        ...state,
        comments: action.payload ?? [],
      };
    case ActionType.ADD_COMMENT:
      const newList = getUniqueListBy([action.payload, ...state.comments], 'pk')
      return {
        ...state,
        comments: newList,
      };
    case ActionType.DEL_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (item) => item.pk !== action.payload.pk,
        ),
      };
    default:
      return state;
  }
};

export default reducer;
