import { Action } from '../actions';
import { ActionType } from '../action-types';
import { DEFAULT_TOKEN } from 'utils/data';

interface AuthState {
  token: string;
  isLoggedIn: boolean;
  isPassOnboarding: boolean;

}

const initialState = {
  token: DEFAULT_TOKEN,
  isLoggedIn: false,
  isPassOnboarding: false
};

const reducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case ActionType.SET_TOKEN:
      return { ...state, token: action.payload.token };

    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isPassOnboarding: action.payload.isPassOnboarding
      };

    case ActionType.LOGIN_FAIL:
      return { ...state };

    case ActionType.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};

export default reducer;
