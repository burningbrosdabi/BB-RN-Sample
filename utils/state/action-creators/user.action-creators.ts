import { createAction } from '@reduxjs/toolkit';
import { StoreInfo } from "model";
import { UserInfo } from "model/user/user";
import { Dispatch } from 'redux';
import { getUserInfo } from 'services/api/user/user.api';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export const setUserName = (userName: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_USER_NAME, payload: userName });
  };
};

export const _setUserInfo = (user: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_USER_INFO, payload: user });
  };
};

export const setUserInfo = createAction<UserInfo>(ActionType.SET_USER_INFO);

export const setRecipients = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_RECIPIENTS, payload: data });
  };
};

export const addRecipient = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ADD_RECIPIENT, payload: data });
  };
};

export const updateRecipient = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.UPDATE_RECIPIENT, payload: data });
  };
};

export const delRecipient = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.DEL_RECIPIENT, payload: data });
  };
};

export const setProvincesList = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_PROVINCES_LIST, payload: data });
  };
};

export const setVouchersList = (data: any) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.SET_VOUCHERS_LIST, payload: data });
  };
};

export const refreshUserInfo = async () => {
  await getUserInfo();
};

export const setFavoriteStore = createAction<StoreInfo[]>(ActionType.SET_FAVORITE_STORES);