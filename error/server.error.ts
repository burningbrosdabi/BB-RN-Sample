import { AxiosError } from 'axios';
import { get, isEmpty } from 'lodash';
import HandledError from './error';
import { AXIOS_NO_CONNECTION_CODE, ServerErrorCode } from './error.constant';

export default class ServerError extends HandledError {
  statusCode?: number;
  response?: any;

  constructor({ error, code: _code }: { error: AxiosError; code?: string }) {
    const code: string = _code ?? _getErrorCode(error);
    super({ error, stack: '', name: 'server_error', code, message: error.message });
    this.statusCode = error.response?.status;
    this.response = get(error, 'response.data', null)
  }

  get friendlyMessage(): string {
    const axiosError = this._error as AxiosError;
    const errorDetail =
      get(axiosError, 'response.data.detail', null) ??
      get(axiosError, 'response.data.user_id', null) ??
      get(axiosError, 'response.data.details', null);
    if (typeof errorDetail === 'string') {
      return errorDetail;
    }

    return super.friendlyMessage;
  }
}

function _getErrorCode(error: AxiosError): string {
  if (error.code && error.code === AXIOS_NO_CONNECTION_CODE) {
    return ServerErrorCode.TIME_OUT;
  } else if (error?.message === ServerErrorCode.NO_CONNECTION) {
    return ServerErrorCode.NO_CONNECTION;
  } else if (isEmpty(error.response)) {
    return ServerErrorCode.NO_RESPONSE;
  }

  return ServerErrorCode.OTHER;
}
