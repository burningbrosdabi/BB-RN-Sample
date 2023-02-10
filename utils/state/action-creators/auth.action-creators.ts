import AsyncStorage from '@react-native-community/async-storage';
import { createAction } from '@reduxjs/toolkit';
import { HandledError } from 'error';
import { get } from 'lodash';
import { Dispatch } from 'redux';
import { clearCartBadge } from 'services/api/cart';
import { getUserFollowingList } from 'services/api/influencer/influencer.api';
import * as AuthService from 'services/auth';
import { updateUserDeviceInfo } from 'services/auth';
import { AuthMethod, Logger } from 'services/log';
import { NotificationService } from 'services/notification';
import {
  feedCollectController,
  feedLikeController,
  productLikeController,
  storeLikeController,
  userFollowController
} from 'services/user';
import { storeKey } from 'utils/constant';
import { DEFAULT_TOKEN } from 'utils/data';
import { asyncGuard, unAwaited } from 'utils/helper/function.helper';
import { store } from 'utils/state';
import {
  getFollowingFeedPk, getLikedComments,
  getLikedFeeds,
  getUserFavoriteProductPks, getUserFavoriteStores,
  getUserInfo
} from '_api';
import { ActionType } from '../action-types';
import { Action } from '../actions';

const dispatch = store.dispatch;

const migrate = async () => {
  /* check saved token for version < 2.4.5
   * if have local token set token to redux
   * and remove cache token by AsyncStorage */
  try {
    // dispatch(setToken(DEFAULT_TOKEN))
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    dispatch(setToken(token));
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    return;
  }
};

export const checkCurrentUser = async () => {
  try {
    await migrate();
    const isLoggedIn = store.getState().auth.isLoggedIn;
    if (!isLoggedIn) {
      updateUserDeviceInfo();
      return;
    }
    const token = store.getState().auth.token;

    const userData = await getUserData({ token });
    await onSuccessfullyAuth({
      token,
      uid: get(userData, 'id'),
    });
  } catch (_) {
    /***/
  }
};

export const setToken = createAction(ActionType.SET_TOKEN, (token: string) => {
  return {
    type: ActionType.SET_TOKEN,
    payload: { token },
  };
});

export const emailSignUp = ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ALERT_CLEAR });
    const { token, message } = await AuthService.signUp({
      email,
      name,
      password,
    });
    if (token) {
      const userData = await getUserData({ token });
      console.log('here')
      dispatch({ type: ActionType.ALERT_SUCCESS, payload: 'Đăng ký thành công' });
      Logger.instance.logSignUp('email');
      await onSuccessfullyAuth({ method: 'email', token, uid: get(userData, 'id') });
    } else {
      dispatch({ type: ActionType.LOGIN_FAIL });
      dispatch({ type: ActionType.ALERT_ERROR, payload: message });
    }
  };
};

export const emailLogin = async ({ email, password }: { email: string; password: string }) => {
  dispatch({ type: ActionType.ALERT_CLEAR });
  const { token, message } = await AuthService.login({ email, password });
  if (token) {
    const userData = await getUserData({ token });
    dispatch({ type: ActionType.ALERT_SUCCESS, payload: 'Đăng nhập thành công' });
    await onSuccessfullyAuth({ method: 'email', token, uid: get(userData, 'id') });
  } else {
    dispatch({ type: ActionType.LOGIN_FAIL });
    dispatch({ type: ActionType.ALERT_ERROR, payload: message });
  }
};

export const sendEmailCode = ({ email }: { email: string }) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ALERT_CLEAR });
    const { data, message } = await AuthService.sendEmailCode({ email });
    if (data) {
      dispatch({ type: ActionType.ALERT_SUCCESS, payload: data.detail || 'Gửi email thành công.' });

      return data;
    } else {
      dispatch({ type: ActionType.ALERT_ERROR, payload: message });
    }
  };
};

export const validateToken = ({ token }: { token: string }) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ALERT_CLEAR });
    const { data, message } = await AuthService.validateToken({ token });
    if (data) {
      dispatch({ type: ActionType.ALERT_SUCCESS, payload: data.detail || 'Thành công' });
      return data;
    } else {
      dispatch({ type: ActionType.ALERT_ERROR, payload: message });
    }
  };
};

export const resetPassword = ({ password, token }: { password: string; token: string }) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ALERT_CLEAR });
    const { data, message } = await AuthService.resetPassword({ password, token });
    if (data) {
      dispatch({
        type: ActionType.ALERT_SUCCESS,
        payload: data.detail || 'Đã đặt lại mật khẩu thành công!',
      });

      return data;
    } else {
      dispatch({ type: ActionType.ALERT_ERROR, payload: message });
    }
  };
};

export const socialLogin = (type: string, currentToken?: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.ALERT_CLEAR });
    const token = store.getState().auth.token;
    if (token && token !== DEFAULT_TOKEN && !currentToken) {
      dispatch({
        type: ActionType.ALERT_SUCCESS,
        payload: currentToken ? 'Liên kết thành công' : 'Đăng nhập thành công',
      });
      // dispatch({type: ActionType.LOGIN_SUCCESS, payload: token});
    } else {
      console.log('1. NEED TO LOGIN');
      let token = null;
      let message = null;
      switch (type) {
        case 'facebook': {
          const response = await AuthService.facebookLogin(currentToken);
          token = response.token;
          message = response.message;
          break;
        }
        case 'apple': {
          const response = await AuthService.appleLogin();
          token = response?.token;
          message = response?.message;
          break;
        }
        default:
          message = 'Chưa chọn hình thức đăng nhập';
      }
      if (token) {
        // token !== DEFAULT_TOKEN
        const userData = await getUserData({ token });
        dispatch({
          type: ActionType.ALERT_SUCCESS,
          payload: currentToken ? 'Liên kết thành công' : 'Đăng nhập thành công',
        });
        await onSuccessfullyAuth({
          method: type as 'facebook' | 'apple',
          token,
          uid: get(userData, 'id'),
        });
      } else {
        if (type === 'apple' && message === 1000) {
          message = 'Đăng nhập bằng Apple bị hủy';
        }
        dispatch({ type: ActionType.LOGIN_FAIL });
        dispatch({ type: ActionType.ALERT_ERROR, payload: message });
      }
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    await AuthService.logout();
    await AsyncStorage.removeItem(storeKey.searchHistoryList);
    clearCartBadge();
    Logger.instance.resetUserId();
    // alert
    dispatch({ type: ActionType.ALERT_CLEAR });
    // user
    dispatch({ type: ActionType.RESET_USER_STATE });
    dispatch({ type: ActionType.LOGOUT });
    AuthService.updateUserDeviceInfo();
  };
};

const onSuccessfullyAuth = async ({
  method,
  token,
  uid,
}: {
  method?: AuthMethod;
  token: string;
  uid: number;
}) => {
  try {
    if (method) Logger.instance.logLogin(method);
    unAwaited(AuthService.updateUserDeviceInfo());
    Logger.instance.setUserId(uid);
    await AsyncStorage.removeItem(storeKey.searchHistoryList);
    // unAwaited(checkCart());
  } catch (error) {
    new HandledError({
      error: error as Error,
      stack: 'auth.action-creators.onSuccessfullyAuth',
    }).log(true);
  }
};

export const getUserFavoriteData = async () => {
  asyncGuard(() =>
    getFollowingFeedPk().then(({ data }) => {
      feedCollectController.reset();
      data.forEach(pk => {
        feedCollectController.stream.next({ pk, is_collected: true });
      });
      feedCollectController.subscribe();
    }),
  );
  asyncGuard(() =>
    getLikedFeeds().then(({ data }) => {
      data.forEach(pk => {
        feedLikeController.stream.next({ pk, like: true });
        // feedLikeController.likeCounts[pk] = 0;
      });
      feedLikeController.subscribe();
    }),
  );
  asyncGuard(() =>
    getUserFavoriteProductPks().then(({ data }) => {
      data.forEach(pk => {
        productLikeController.stream.next({ pk, is_liked: true });
      });
      productLikeController.subscribe();
    }),
  );
  // asyncGuard(() =>
  //   getUserFavoriteStores().then(data => {
  //     const { data: pks } = data;
  //     pks.forEach(pk => {
  //       storeLikeController.stream.next({ pk, is_following: true });
  //     });
  //     storeLikeController.subscribe();
  //     return data;
  //   }),
  // );
  asyncGuard(() =>
    getUserFollowingList().then(({ data }) => {
      data.forEach(pk => {
        userFollowController.stream.next({ pk, is_following: true });
      });

      userFollowController.subscribe();
    }),
  );
  asyncGuard(() => getLikedComments());
  asyncGuard(() => NotificationService.instance.checkUnread());
};

const getUserData = async ({ token }: { token: string }) => {
  dispatch(setToken(token));
  const userData = await getUserInfo();
  await getUserFavoriteData();
  dispatch({
    type: ActionType.LOGIN_SUCCESS,
    payload: { isPassOnboarding: userData.is_pass_onboarding }
  });
  return userData;
};
