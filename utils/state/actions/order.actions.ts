import { ActionType } from '../action-types';

interface SetCancelReasons {
  type: ActionType.SET_CANCEL_REASONS;
  payload: any;
}

interface SetExchangeReasons {
  type: ActionType.SET_EXCHANGE_REASONS;
  payload: any;
}


export type OrderAction =
  | SetCancelReasons
  | SetExchangeReasons
