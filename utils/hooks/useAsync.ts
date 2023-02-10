import { HandledError } from 'error';
import { isEmpty, isNil } from 'lodash';
import { useCallback, useState } from 'react';
import { LayoutAnimation } from 'react-native';

export enum ConnectionState {
  none = 'none',
  waiting = 'waiting',
  hasData = 'hasData',
  hasEmptyData = 'hasEmptyData',
  hasError = 'hasError',
}

export interface IUseAsyncReturned<T> {
  state: ConnectionState;
  data: T | null;
  error: Error | null;
  excecute: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  props?: {
    emptyDataLogical?: (data: T) => boolean;
    initialState?: ConnectionState;
    refreshFn?: () => Promise<T>;
    animated?: boolean;
    errorConfig?: {
      stack: string;
    };
  },
): IUseAsyncReturned<T> {
  const { emptyDataLogical, initialState, refreshFn, animated, errorConfig } = props ?? {};
  const [connectionState, _setConnectionState] = useState<ConnectionState>(
    initialState ?? ConnectionState.none,
  );

  const setConnectionState = (value: ConnectionState) => {
    if (animated) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    _setConnectionState(value);
  };
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<HandledError | null>(null);

  const reset = () => {
    setData(null);
    setError(null);
    setConnectionState(ConnectionState.none);
  };

  const fetch = (promiseFunction: () => Promise<T>) => {
    return promiseFunction()
      .then((data: T) => {
        setData(data);
        if ((emptyDataLogical && emptyDataLogical(data)) || isEmpty(data)) {
          setConnectionState(ConnectionState.hasEmptyData);
        } else {
          setConnectionState(ConnectionState.hasData);
        }
      })
      .catch(e => {
        const error = new HandledError({
          error: e as Error,
          stack: errorConfig?.stack ?? 'useAsync',
        });
        if (!isNil(errorConfig)) {
          error.log(true);
        }
        setError(error);
        setConnectionState(ConnectionState.hasError);
      });
  };

  const exec = useCallback(() => {
    setConnectionState(ConnectionState.waiting);

    return fetch(asyncFunction);
  }, [asyncFunction]);

  let refresh: () => Promise<void>;

  if (!refreshFn) {
    refresh = () => fetch(asyncFunction);
  } else {
    refresh = useCallback(() => {
      setConnectionState(ConnectionState.waiting);

      return fetch(refreshFn);
    }, [refreshFn]);
  }

  return { state: connectionState, data, error, excecute: exec, refresh, reset };
}

export class AsyncSnapshot<T> {
  connectionState: ConnectionState;
  data?: T;
  error?: Error;

  constructor({
    connectionState,
    data,
    error,
  }: {
    connectionState: ConnectionState;
    data?: T;
    error?: Error;
  }) {
    this.connectionState = connectionState;
    this.data = data;
    this.error = error;
  }

  copyWith({
    connectionState,
    data,
    error,
  }: {
    connectionState?: ConnectionState;
    data?: T;
    error?: Error;
  }): AsyncSnapshot<T> {
    this.connectionState = connectionState ?? this.connectionState;

    if (this.connectionState !== ConnectionState.hasData) {
      this.data = undefined;
      this.error = undefined;
    } else {
      this.data = data ?? this?.data;
      this.error = error ?? this?.error;
    }
    return this;
  }
}
