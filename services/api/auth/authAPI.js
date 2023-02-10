import { fetchWithTimeOut } from '../api_helper';
import { apiUrl } from '../api_variables';

// TODO Handle network request failed with https://medium.com/to-err-is-aaron/detect-network-failures-when-using-fetch-40a53d56e36
const basicOptions = {
  method: 'POST',
  mode: 'cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
  },
};

export const getUserInfoFromFacebook = async (token) => {
  const responseJson = await fetchWithTimeOut(
    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large),birthday,email`,
  );
  return responseJson;
};

export const getOrCreateServerTokenWithFBToken = async (token) => {
  const getFacebookTokenAPIURL = apiUrl + 'user/facebook/';
  const options = {
    ...basicOptions,
    body: JSON.stringify({
      access_token: token,
    }),
  };
  console.log(token);
  // REACT NATIVE TOKEN > SERVER > SERVER TOKEN
  console.log('......Checking Token is in Server......');
  const serverToken = await fetch(getFacebookTokenAPIURL, options)
    .then((response) => {
      const data = response.json();
      const statusCode = response.status;
      return Promise.all([statusCode, data]);
    })
    .then(async ([res, data]) => {
      if (res == 200) {
        console.log('......Find/Token in Server.....' + data);
        console.log(data);
        return data.key;
      } else {
        console.log([res, data]);
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
  return serverToken;
};

export const connectFacebookToken = async (connectToken, token) => {
  console.log(connectToken, token);
  const connectFacebookTokenAPIURL = apiUrl + 'user/facebook/connect/';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + connectToken,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      access_token: token,
    }),
  };
  // REACT NATIVE TOKEN > SERVER > SERVER TOKEN
  const connection = fetch(connectFacebookTokenAPIURL, options)
    .then((response) => {
      const data = response.json();
      const statusCode = response.status;
      return Promise.all([statusCode, data]);
    })
    .then(async ([res, data]) => {
      console.log(res);
      console.log(data);
      return { res: res, finalToken: data.key };
    })
    .catch((error) => {
      return error;
    });
  return connection;
};

export const createUserPickInfo = async (token, pickResults) => {
  const createUserPickInfoAPIURL = apiUrl + 'pick/pick-ab/create/';
  const results = await Promise.all(
    pickResults.map(async ({ pick, selection }) => {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: 'token ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          pick_AB: pick,
          selection,
        }),
      };
      const result = await fetch(createUserPickInfoAPIURL, options)
        .then((response) => response.json())
        .then((responseJson) => {
          return responseJson;
        });
      return result;
    }),
  );
  return results;
};

export const getUserProductWatchedList = async (token, offset = 0) => {
  const getUserProductWatchedListAPIURL =
    apiUrl + 'user/me/view/product/?limit=20&offset=' + offset;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const responseJson = await fetchWithTimeOut(getUserProductWatchedListAPIURL, options);
  return { totalCount: responseJson.count, data: responseJson.results };
};

export const getOrCreateServerTokenWithAppleToken = async (token) => {
  const getAppleTokenAPIURL = apiUrl + 'user/apple/';

  const options = {
    ...basicOptions,
    body: JSON.stringify({
      client_token: token,
    }),
  };
  console.log(token);
  // REACT NATIVE TOKEN > SERVER > SERVER TOKEN
  console.log('......Checking Token is in Server......');
  console.log(getAppleTokenAPIURL);
  const serverToken = await fetch(getAppleTokenAPIURL, options)
    .then((response) => {
      const data = response.json();
      console.log(data);
      const statusCode = response.status;
      return Promise.all([statusCode, data]);
    })
    .then(async ([res, data]) => {
      if (res == 200) {
        console.log('......Find/Token in Server.....' + data);
        console.log(data);
        return data.key;
      } else {
        console.log([res, data]);
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
  return serverToken;
};

export const connectAppleToken = async (connectToken, token) => {
  console.log(connectToken, token);
  const connectAppleTokenAPIURL = apiUrl + 'user/apple/connect/';
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + connectToken,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      client_token: token,
    }),
  };
  // REACT NATIVE TOKEN > SERVER > SERVER TOKEN
  const connection = fetch(connectAppleTokenAPIURL, options)
    .then((response) => {
      const data = response.json();
      const statusCode = response.status;
      return Promise.all([statusCode, data]);
    })
    .then(async ([res, data]) => {
      console.log(res);
      console.log(data);
      return { res: res, finalToken: data.key };
    })
    .catch((error) => {
      console.log('this is errorrrrr');
      return error;
    });
  return connection;
};

export const appleSignInCreate = async (access_token, name) => {
  console.log(access_token, name);
  const connectAppleTokenAPIURL = apiUrl + 'user/apple/sign-in/'
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: name ? JSON.stringify({
      access_token,
      name,
    }) : JSON.stringify({
      access_token,
    })
  };

  const connection = fetch(connectAppleTokenAPIURL, options)
    .then((response) => {
      const data = response.json();
      const statusCode = response.status;
      return Promise.all([statusCode, data]);
    })
    .then(async ([res, data]) => {
      console.log(res);
      console.log(data);
      return {
        res: res,
        finalToken: data.key,
        message: data.access_token?.length > 0 ? "access_token - " + data.access_token[0] :
          data.name?.length > 0 ? "name - " + data.name[0] :
            data.non_field_errors?.length > 0 ? data.non_field_errors[0] : "Đăng nhập thất bại, vui lòng thử lại."
      };
    })
    .catch((error) => {
      console.log('this is errorrrrr');
      return error;
    });
  return connection;
};
