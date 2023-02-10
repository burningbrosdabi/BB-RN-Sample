import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export const setTotalComments = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_TOTAL_COMMENTS, payload: data });
  };
};

export const setComments = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_COMMENTS, payload: data });
  };
};

export const addComment = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ADD_COMMENT, payload: data });
  };
};

export const delComment = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.DEL_COMMENT, payload: data });
  };
};
