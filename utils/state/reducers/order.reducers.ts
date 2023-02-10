import { ActionType } from '../action-types';
import { Action } from '../actions';

interface OrderState {
  cancelReasons: { [key: string]: string };
  exchangeReasons: { [key: string]: string };

}

const initialState = {
  cancelReasons: {},
  exchangeReasons: {},
};

const reducer = (state: OrderState = initialState, action: Action): OrderState => {
  switch (action.type) {
    case ActionType.SET_CANCEL_REASONS:
      return {
        ...state,
        cancelReasons: action.payload ?? {},
      };
    case ActionType.SET_EXCHANGE_REASONS:
      return {
        ...state,
        exchangeReasons: action.payload ?? {},
      };
    default:
      return state;
  }
};

export default reducer;
