import { isEmpty } from 'lodash';
import { DEFAULT_TOKEN } from '_utils/data';

export async function fetchWithTimeOut(requestURL, options = null) {
  // const { token } = useTypedSelector((state) => state.auth);
  const defaultOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + DEFAULT_TOKEN,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  try {
    const response = await Promise.race([
      await fetch(requestURL, options ?? defaultOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
    ]);

    let responseJson = {}
    try {
      responseJson = await response.json();
    } catch (error) {
      console.log(
        'REQUEST',
        [
          '',
          `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
          `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
          `--header 'Content-Type: application/json'`,
        ].join(' \\\n'),
      );
    }

    return responseJson;
  } catch (error) {
    // Sentry.Native.captureMessage(eror.messager);
    if (error.message === 'Timeout' || error.messager === 'Network request failed') {
      const response = await Promise.race([
        await fetch(requestURL, options ?? defaultOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
      ]);

      let responseJson = {}
      try {
        responseJson = await response.json();
      } catch (error) {
        console.log(
          'REQUEST',
          [
            '',
            `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
            `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
            `--header 'Content-Type: application/json'`,
          ].join(' \\\n'),
        );
      }

      return responseJson;
      // retry TODO 여기에 Alert을 넣어야 할지 고민
    }
  }
}

export async function fetchWithTimeOutWithToken(requestURL, token, options = null) {
  const defaultOptions = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  try {
    const response = await Promise.race([
      await fetch(requestURL, options ?? defaultOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
    ]);

    let responseJson = {}
    try {
      responseJson = await response.json();
    } catch (error) {
      console.log(
        'REQUEST',
        [
          '',
          `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
          `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
          `--header 'Content-Type: application/json'`,
        ].join(' \\\n'),
      );
    }

    return responseJson;
  } catch (error) {
    // Sentry.Native.captureMessage(eror.messager);
    if (error.message === 'Timeout' || error.messager === 'Network request failed') {
      const response = await Promise.race([
        await fetch(requestURL, options ?? defaultOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
      ]);

      let responseJson = {}
      try {
        responseJson = await response.json();
      } catch (error) {
        console.log(
          'REQUEST',
          [
            '',
            `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
            `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
            `--header 'Content-Type: application/json'`,
          ].join(' \\\n'),
        );
      }

      return responseJson;
      // retry TODO 여기에 Alert을 넣어야 할지 고민
    }
  }
}

export async function FetchPreset({
  requestURL,
  token,
  method = 'GET',
  options = null,
  body = null,
}) {
  let defaultOptions = {
    method: method,
    mode: 'cors',
    headers: {
      Authorization: token && 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  if (body) {
    defaultOptions = { ...defaultOptions, body: JSON.stringify(body) };
  }
  let response;
  try {
    response = await Promise.race([
      await fetch(requestURL, options ?? defaultOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 5000))),
    ]);
  } catch (error) {
    if (error.message === 'Timeout' || error.messager === 'Network request failed') {
      response = await Promise.race([
        await fetch(requestURL, options ?? defaultOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 5000))),
      ]);
    }
  }
  if (response.status == 204) {
    return;
  }
  if (response.status == 401) {
    const message = await response.json();
    throw new Error(message.detail);
  }

  let responseJson = {}
  try {
    responseJson = await response.json();
  } catch (error) {
    console.log(
      'REQUEST',
      [
        `[${response.status}]`,
        `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
        `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
        `--header 'Content-Type: application/json'`,
        `--data-raw '${!isEmpty(body) ? JSON.stringify(body) : '{}'}'`,
      ].join(' \\\n'),
    );
  }

  return responseJson;
}

export async function POSTFetchPreset({ requestURL, token, options = null, body = null }) {
  let defaultOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: token && 'token ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  if (body) {
    defaultOptions = { ...defaultOptions, body: JSON.stringify(body) };
  }
  try {
    const response = await Promise.race([
      await fetch(requestURL, options ?? defaultOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
    ]);
    if (response?.status == 204) {
      return;
    }
    const data = await response?.json();
    const res = response?.status;
    return { data, res };
  } catch (error) {
    // Sentry.Native.captureMessage(eror.messager);
    if (error.message === 'Timeout' || error.messager === 'Network request failed') {
      const response = await Promise.race([
        await fetch(requestURL, options ?? defaultOptions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
      ]);

      let data = {}
      try {
        data = await response.json();
      } catch (error) {
        console.log(
          'REQUEST',
          [
            '',
            `--request ${defaultOptions.method.toUpperCase()} '${requestURL}'`,
            `--header 'Authorization: ${defaultOptions.headers?.Authorization ?? ''}'`,
            `--header 'Content-Type: application/json'`,
            `--data-raw '${!isEmpty(body) ? JSON.stringify(body) : '{}'}'`,
          ].join(' \\\n'),
        );
      }

      const res = response.status;
      return { data, res };
      // retry TODO 여기에 Alert을 넣어야 할지 고민
    }
  }
}

// TODO react-query
// https://react-query.tanstack.com/videos
