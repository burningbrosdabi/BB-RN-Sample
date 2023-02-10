import { ActionType } from '../action-types';

interface AlertSuccess {
  type: ActionType.ALERT_SUCCESS;
  payload: string;
}

interface AlertError {
  type: ActionType.ALERT_ERROR;
  payload: string;
}

interface AlertClear {
  type: ActionType.ALERT_CLEAR;
}

export type ActionAlert = AlertSuccess | AlertError | AlertClear;
