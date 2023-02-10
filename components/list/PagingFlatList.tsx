import { useEffect, useRef, useState } from 'react';
import { PaginationResponse } from 'services/http/type';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { PagingFetch } from './type';
import { isNil } from 'lodash';
import {NativeScrollEvent, NativeSyntheticEvent} from "react-native";

export const usePagingFetch = <T extends unknown>({
  initialData,
  fetch,
  next,
  limit = 20,
}: {
  initialData?: T[];
  fetch: PagingFetch<T>;
  next?: string;
  limit?: number;
}): {
  data: T[];
  state: ConnectionState;
  endReached: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
} => {
  const [data, setData] = useState<T[]>(initialData ?? []);
  const nextUrl = useRef<string | undefined>(next);

  const isEndReached = (data:T[]) => {
    return isNil(nextUrl.current)
  }

  const [endReached, setEndReached] = useState(isEndReached(data));


  const {
    data: additionalData,
    state,
    excecute,
  } = useAsync<PaginationResponse<T>>(() => fetch(nextUrl.current));

  const onTriggerFetchData = () => {
    if (endReached || (state !== ConnectionState.none && state !== ConnectionState.hasData) ) {
      return;
    }
    excecute();
  };

  useEffect(() => {
    if (!additionalData) return;
    nextUrl.current = additionalData.next ?? undefined;

    if (isEndReached(additionalData.results)) {
      setEndReached(true);
    }

    setData(currentData => {
      const newData = currentData.concat(additionalData.results);

      return newData;
    });
  }, [additionalData]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //   console.log(event.nativeEvent.contentOffset.y / event.nativeEvent.contentSize.height);
    if (endReached) return;
    if (event.nativeEvent.contentOffset.y / event.nativeEvent.contentSize.height >= 0.5) {
      onTriggerFetchData();
    }
  };

  return {
    data,
    state,
    endReached,
    onScroll
  };
};

