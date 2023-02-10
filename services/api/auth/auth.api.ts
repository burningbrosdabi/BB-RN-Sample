import { HandledError } from 'error';
import { Http } from 'services/http/http.service';
import { FetchPreset, POSTFetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import messaging from '@react-native-firebase/messaging';

export const getEmailToken = async ({ email, password }) => {
  const requestURL = apiUrl + 'user/token/';
  const body = { email, password };
  const response = await POSTFetchPreset({
    requestURL,
    body,
  });
  return response;
};

export const sendEmailCode = async ({ email }: { email: string }) => {
  const requestURL = apiUrl + 'password-reset/';
  const body = { email };
  const response = await POSTFetchPreset({ requestURL, body });
  return response;
};

export const validateToken = async ({ token }: { token: string }) => {
  const requestURL = apiUrl + 'password-reset/validate_token/';
  const body = { token };
  const response = await POSTFetchPreset({ requestURL, body });
  return response;
};

export const resetPassword = async ({ password, token }: { password: string, token: string }) => {
  const requestURL = apiUrl + 'password-reset/confirm/'
  const body = { password, token };
  const response = await POSTFetchPreset({ requestURL, body });
  return response;
};

export const createEmailAccount = async ({ email, name, password }) => {
  const requestURL = apiUrl + 'user/create/';
  const body = { email, password, name };
  const response = await POSTFetchPreset({
    requestURL,
    body,
  });

  return response;
};

export const updateUserDeviceInfo = async (
  device_push_token: string,
  device_id: string,
): Promise<void> => {
  try {
    await Http.instance.post('devices/', {
      device_id,
      device_push_token,
    });
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'AuthApi.updateUserDeviceInfo',
    });
    throw exception;
  }
};

export const removeUserFCMToken = async () => {
  try {
    const token = await messaging().getToken();

    return Http.instance.delete(`devices/${token}/`);
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'AuthApi.removeUserFCMToken',
    });
  }
};
