import { Action } from '../actions';
import { ActionType } from '../action-types';

interface AlertState {
  message: null | string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

const initialState = {
  message: null,
  type: 'warning',
};

const reducer = (state: AlertState = initialState, action: Action): AlertState => {
  switch (action.type) {
    case ActionType.ALERT_SUCCESS:
      return { ...state, message: action.payload, type: 'success' };

    case ActionType.ALERT_ERROR:
      return { ...state, message: action.payload, type: 'danger' };

    case ActionType.ALERT_CLEAR:
      return { ...state, message: null };
    default:
      return state;
  }
};

export default reducer;
