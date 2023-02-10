import NetInfo from '@react-native-community/netinfo';
import { nanoid } from '@reduxjs/toolkit';
import * as sentry from '@sentry/react-native';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  default as Axios,
} from 'axios';
import { ServerError, ServerErrorCode } from 'error';
import { get, isEmpty, isNil, truncate } from 'lodash';
import { JSONType } from 'model';
import { apiUrl } from 'services/api/api_variables';
import { HTTPRequestLog, HTTPResponseLog } from 'services/log';
import { Logger } from 'services/log/log.service';
import { DEFAULT_TOKEN } from 'utils/data';
import { isProduction } from 'utils/helper';
import { store } from 'utils/state';

export class Http {
  protected static _instance: Http;
  protected _axios: AxiosInstance = Axios.create({
    baseURL: apiUrl,
    timeout: 10000,
  });

  protected constructor() {
    this._intercept(this._axios);
  }

  static get instance(): AxiosInstance {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance._axios;
  }

  private async _checkConnection(req: AxiosRequestConfig) {
    const infoState = await NetInfo.fetch();
    if (infoState.isConnected) return;
    const error: AxiosError = {
      name: 'NO_CONNECTION',
      message: 'NO_CONNECTION',
      config: req,
      code: ServerErrorCode.NO_CONNECTION,
      isAxiosError: false,
      request: {
        ...req,
        _url: req.url,
        _method: req.method,
      },
      toJSON: () => ({}),
    };

    throw error;
  }

  private get isStaging(): boolean {
    return !isProduction();
  }

  protected _intercept(instance: AxiosInstance, testToken?: string) {
    instance.interceptors.request.use(
      req => {
        return this._checkConnection(req)
          .then(() => {
            const state = store.getState();
            const token = testToken ?? state.auth.token;
            const { headers } = req as { headers: { [id: string]: string } };

            if (!(req.url?.includes('devices/') && token === DEFAULT_TOKEN)) {
              headers.Authorization = `token ${token}`;
            }

            headers['X-Trace-Id'] = nanoid(12);
            this.logReq(req);

            return req;
          })
          .catch(error => {
            throw error;
          });
      },
      error => {
        return Promise.reject(error);
      },
    );
    instance.interceptors.response.use(
      (res: AxiosResponse) => {
        this.responseIntercepLogging(res);

        return res;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // logout
        }
        const serverError = new ServerError({ error });
        this.onRejectedInterceptLogging(error, 'response');

        return Promise.reject(serverError);
      },
    );
  }

  private logReq(req: AxiosRequestConfig) {
    const { url = '', headers, params, method = 'GET', data, baseURL } = req;
    let searchParams = '';
    if (!isEmpty(params)) {
      searchParams = `?${new URLSearchParams(params as Record<string, string>).toString()}`;
    }

    const curlList = [
      '',
      `curl --location --request ${method.toUpperCase()} '${baseURL}${url}${searchParams}'`,
      `--header 'Authorization: ${headers?.Authorization ?? ''}' `,
      `--header 'Content-Type: application/json'`,
      `--data-raw '${!isEmpty(data) ? JSON.stringify(data) : '{}'}'`,
    ];

    if (this.isStaging) {
      Logger.instance.log('REQUEST', curlList.join(' \\\n'));
      Logger.instance.logKibana(
        new HTTPRequestLog(
          headers['X-Trace-Id'],
          curlList.join(' '),
          `[${method.toUpperCase()}] ${url}${searchParams}`,
        ),
      );
    } else {
      sentry.addBreadcrumb({
        type: 'http',
        category: 'request',
        level: sentry.Severity.Log,
        message: 'REQUEST',
        data: {
          curl: curlList.join(' '),
        },
      });
    }
  }

  private responseIntercepLogging(res: AxiosResponse) {
    const { config: req, data, status } = res;
    const { baseURL, url, method = 'GET', headers } = req;
    // @ts-ignore
    if (this.isStaging) {
      Logger.instance.log(
        'RESPONSE',
        [
          '',
          // tslint:disable-next-line: no-unsafe-any
          `${method.toUpperCase()}: ${baseURL}${url}`,
          `status: ${status}`,
          // `data:${JSON.stringify(data) ?? '{}'}`,
        ].join('\n'),
      );
    } else {
      const dataOjb: { [id: string]: any } = {
        status,
        url: `${baseURL?.replace(/\/+$/, '')}${url}`,
        data: isNil(data)
          ? '{}'
          : truncate(JSON.stringify(data), {
              length: 500,
            }),
      };

      sentry.addBreadcrumb({
        type: 'http',
        category: 'response',
        level: sentry.Severity.Log,
        message: 'RESPONSE',
        data: dataOjb,
      });
    }
    Logger.instance.logKibana(
      new HTTPResponseLog(headers['X-Trace-Id'], { status }, `[${method.toUpperCase()}] ${url}`),
    );
  }

  private onRejectedInterceptLogging(error: AxiosError, type: 'request' | 'response') {
    const { status, data } = error?.response ?? {};
    const { _url: url, _method: method, _headers } = (error.request as JSONType) ?? {};
    if (this.isStaging) {
      Logger.instance.log(
        `ERROR ON ${type.toUpperCase()} | ❌❌❌`,
        [
          '',
          `${method.toUpperCase()}: ${url}`,
          `status: ${status}`,
          //   `data: ${JSON.stringify(data, null, 4)}`,
        ].join('\n'),
      );
    } else {
      const dataOjb: { [id: string]: any } = {
        url,
        status,
        data: JSON.stringify(error?.response?.data) ?? {},
      };

      sentry.addBreadcrumb({
        type: 'http',
        category: 'error',
        level: sentry.Severity.Error,
        message: 'ERROR',
        data: dataOjb,
      });
    }
    Logger.instance.logKibana(
      new HTTPResponseLog(
        get(_headers, ['x-trace-id'], ''),
        { status, data },
        `[${method.toUpperCase()}] ${url}`,
      ),
    );
  }
}

export class HttpMock extends Http {
  protected static _mockInstance: HttpMock;

  protected _axios: AxiosInstance = Axios.create({
    baseURL: 'https://04a2cbce-f8c1-4db6-a9f7-b62ecd711da7.mock.pstmn.io/api/',
    timeout: 10000,
  });

  protected constructor() {
    super();
    this._intercept(this._axios, DEFAULT_TOKEN);
  }

  static get instance(): AxiosInstance {
    // if(!isStaging) return super.instance;
    if (!this._mockInstance) {
      this._mockInstance = new this();
    }

    return this._mockInstance._axios;
  }
}

export const http = (mock?: boolean) => {
  if (mock) return HttpMock.instance;

  return Http.instance;
};
