import AsyncStorage from '@react-native-community/async-storage';
import { fetchWithTimeOut } from '../api_helper';
import { apiUrl } from '../api_variables';

export const updateStoreData = async (token) => {
  const getStoreAPIURL = apiUrl + 'store/stores/?limit=30';
  let options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getStoreAPIURL, options);
  return responseJson.results;
};
