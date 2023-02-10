import { random } from 'lodash';
import { Logger } from 'services/log';
import { errorDictionary, UNHANDLED_EXCEPTION } from './error.constant';
import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from '@sentry/react-native';
import { store } from 'utils/state/store';
import { Primitive } from 'utils/types';

export default class HandledError implements Error {
  id = random(0xffffff).toString(16).toUpperCase().padStart(6, '0');
  name = '';
  private _message = '';
  stack = '';
  protected _error: Error;
  private _code = UNHANDLED_EXCEPTION;
  errorDictionary = errorDictionary;
  private _extra?: { [id: string]: Primitive };

  set extra(value: { [id: string]: string }) {
    this._extra = value;
  }

  private get _hasNext(): boolean {
    return this._error instanceof HandledError;
  }

  get rootError(): HandledError {
    if (this._hasNext) return (this._error as HandledError).rootError;
    else return this;
  }

  get message(): string {
    if (!this._hasNext) return this._message;
    else return this.rootError._error.message;
  }

  get fullStackTrace(): string {
    if (!this._hasNext) return this.stack;
    else return `${this.stack}/${(this._error as HandledError).fullStackTrace}`;
  }

  get code(): string {
    if (!this._hasNext) return this._code;

    return this.rootError.code;
  }

  constructor({
    error,
    stack,
    name,
    code,
    message,
    extra,
  }: {
    error: Error;
    stack: string;
    name?: string;
    code?: string;
    message?: string;
    extra?: { [id: string]: Primitive };
  }) {
    this._error = error;
    this.stack = stack;
    this.name = name ?? 'handled_error';
    this._code = code ?? UNHANDLED_EXCEPTION;
    this._message = message ?? error?.message ?? '';
    this._extra = extra;
  }

  get friendlyMessage(): string {
    if (!this._hasNext) {
      const errCode = hexErrorCode(this._code) ?? this.id;
      if (!this.errorDictionary[this.code]) this._code = UNHANDLED_EXCEPTION;

      return `${this.errorDictionary[this.code]} (#${errCode.padStart(6, '0')})`;
    }

    return this.rootError.friendlyMessage;
  }

  log(shouldBeRecorded?: boolean): void {
    Logger.instance.logError(this);
    if (shouldBeRecorded) {
      let rootException = this.rootError._error;
      if (rootException instanceof HandledError) {
        rootException = new Error(rootException.message);
        rootException.name = this.name;
        rootException.stack = this.stack;
      }
      const uid = store.getState()?.user?.userInfo?.id ?? 'UNKNOWN';
      crashlytics().recordError(rootException);
      Sentry.captureException(rootException, {
        user: { id: `${uid}` },
        extra: this.extra,
      });
      Logger.instance.logErrorGA(this);
    }
  }
}

function hexErrorCode(code: string): string | null {
  const index = Object.keys(errorDictionary).lastIndexOf(code);
  /// skip the UNHANDLED_ERROR and UNKNOWN index
  if (index >= 1) return index.toString(16);

  return null;
}
