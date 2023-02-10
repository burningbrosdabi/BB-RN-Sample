import { Action } from '../actions';
import { ActionType } from '../action-types';

interface LoadingState {
  isLoading: boolean;
}

const initialState = {
  isLoading: false,
};

const reducer = (state: LoadingState = initialState, action: Action): LoadingState => {
  switch (action.type) {
    case ActionType.TOGGLE_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default reducer;
