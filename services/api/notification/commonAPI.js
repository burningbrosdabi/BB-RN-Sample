import { Http } from 'services/http/http.service';
import { sleep } from 'utils/helper';
import { FetchPreset, fetchWithTimeOut } from '../api_helper';
import { apiUrl } from '../api_variables';

export const getNotificationList = async (token) => {
  const getNotificationListAPIURL = apiUrl + 'notification/me/';
  let options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getNotificationListAPIURL, options);
  return {
    totalCount: responseJson.count,
    data: responseJson.results,
  };
};

export const getNotificationListByToken = async (token, pushToken) => {
  const getNotificationListByTokenAPIURL = apiUrl + 'notification/me/token/' + pushToken;
  let options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getNotificationListByTokenAPIURL, options);
  return {
    totalCount: responseJson.count,
    data: responseJson.results,
  };
};

export const updateNotificationState = async (token, pk) => {
  const updateNotificationAPIURL = apiUrl + 'notification/update/' + pk;
  let options = {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      is_read: true,
    }),
  };

  const data = await fetch(updateNotificationAPIURL, options)
    .then((response) => response.json())
    .then((responseJson) => { });
  return data;
};

export const getProvincesData = async ({ token }) => {
  try {
    const response = await Http.instance.get('v1/address-data/provinces/?limit=63');
    return { totalCount: response.data.count, data: response.data.results };
  } catch (error) {
    throw error;
  }
};

export const getDistrictsData = async ({ token, provinceId }) => {
  const requestURL = apiUrl + `v1/address-data/districts/?province_id=${provinceId}&limit=1000`;
  console.log(requestURL);
  const responseJson = await FetchPreset({ requestURL, token });
  console.log(responseJson);
  return { totalCount: responseJson.count, data: responseJson.results };
};

export const getWardsData = async ({ token, districtId }) => {
  const requestURL = apiUrl + `v1/address-data/wards/?district_id=${districtId}&limit=1000`;
  console.log(requestURL);
  const responseJson = await FetchPreset({ requestURL, token });
  console.log(responseJson);
  return { totalCount: responseJson.count, data: responseJson.results };
};
