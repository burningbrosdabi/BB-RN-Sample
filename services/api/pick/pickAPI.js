import { fetchWithTimeOut } from '../api_helper';
import { apiUrl } from '../api_variables';

export const getUserPick = async (token) => {
  const getUserPickAPIURL = apiUrl + 'pick/pick-set/';
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getUserPickAPIURL, options);
  return responseJson.results;
};

export const getMyRecentPickList = async (token, offset = 0) => {
  const getUserPickAPIURL = apiUrl + 'pick/me/?limit=10&offset=' + offset;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getUserPickAPIURL, options);
  return { totalCount: responseJson.count, data: responseJson.results };
};
