import { ActionType } from '../action-types';
import { Action } from '../actions';

interface StoreState {
  cityFilter: any;
  styleFilter: any
  ageFilter: any
}

const initialState = {
  cityFilter: [],
  styleFilter: [],
  ageFilter: [],
};

const reducer = (state: StoreState = initialState, action: Action): StoreState => {
  switch (action.type) {
    case ActionType.SET_STORE_FILTER:
      return {
        ...state,
        cityFilter: action.payload.city,
        styleFilter: action.payload.style,
        ageFilter: action.payload.age,
      };
    case ActionType.RESET_STORE_FILTER:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
