import { ActionType } from '../action-types';

interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS;
  payload: { isPassOnboarding: boolean };
}

interface LoginFailAction {
  type: ActionType.LOGIN_FAIL;
}

export interface SetTokenAction {
  type: ActionType.SET_TOKEN;
  payload: string;
}

interface Logout {
  type: ActionType.LOGOUT;
}

export type AuthAction = LoginSuccessAction | LoginFailAction | SetTokenAction | Logout;
