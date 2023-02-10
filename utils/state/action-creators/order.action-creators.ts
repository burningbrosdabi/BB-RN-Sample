import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import {getCancelReasonsApi, getExchangeReasonsApi} from '_api';
import { ButtonType } from 'components/button/Button';
import { dispatch, store } from 'utils/state';
import { showDialog } from 'utils/state/action-creators/app.action-creators';
import { isEmpty } from 'lodash';
import {HandledError} from "error";



export const setCancelReasons = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_CANCEL_REASONS, payload: data });
  };
};

export const setExchangeReasons = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_EXCHANGE_REASONS, payload: data });
  };
};

export const getCancelReasons = async () => {
  try {
    let reasons = store.getState().order.cancelReasons;
    if (!isEmpty(reasons)) return reasons;
    reasons = await getCancelReasonsApi();
    dispatch(setCancelReasons(reasons));
    return reasons;
  } catch (error) {
    dispatch(
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => {},
          },
        ],
      }),
    );
  }
};

export const getExchangeReasons = async () => {
  try {
    const reasons = store.getState().order.exchangeReasons;
    if (!isEmpty(reasons)) return reasons;
    const reasonsList = await getExchangeReasonsApi();
    dispatch(setExchangeReasons(reasonsList));
  } catch (error) {
    dispatch(showDialog({
      title: (error as HandledError).friendlyMessage,
      actions: [
        {
          type: ButtonType.primary,
          text: 'Ok',
          onPress: () => {},
        },
      ],
    }));
  }
};
