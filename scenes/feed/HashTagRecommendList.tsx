import React, { useContext, useEffect, useRef, useState } from 'react';
import { AsyncSnapshot, ConnectionState } from 'utils/hooks/useAsync';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { isEmpty, last } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { searchHashtag } from '_api';
import Ripple from 'react-native-material-ripple';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Colors, Typography } from 'styles';
import { FeedWritingContext } from 'scenes/feed/context';
import { hashtagRegex } from '_helper';
import { PaginationResponse } from 'services/http/type';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { CommentItemModel } from 'model';

class HashtagAsyncSnapshot extends AsyncSnapshot<PaginationResponse<string>> {
  hashtag?: string;

  constructor({
    connectionState,
    data,
    error,
  }: {
    connectionState: ConnectionState;
    data?: PaginationResponse<string>;
    error?: Error;
  }) {
    super({
      connectionState,
      data,
      error,
    });
  }

  copyWith({
    connectionState,
    data,
    error,
    hashtag,
  }: {
    connectionState?: ConnectionState;
    data?: PaginationResponse<string>;
    error?: Error;
    hashtag?: string;
  }) {
    this.hashtag = hashtag ?? this.hashtag;
    return super.copyWith({
      connectionState,
      data,
      error,
    });
  }
}

export const HashtagList = () => {
  const { inputStream, appendHashtag } = useContext(FeedWritingContext);
  const [connectionState, setConnectionState] = useState(ConnectionState.none);
  const [data, setData] = useState<PaginationResponse<string> | undefined>();

  const connectionStream = useRef(
    new BehaviorSubject(
      new HashtagAsyncSnapshot({
        connectionState: ConnectionState.none,
      }),
    ),
  ).current;

  const requestStream = useRef(new Subject<string>()).current;

  const getHashtag = (text: string, cursorPos: number) => {
    const _text = text.substring(0, cursorPos);
    const words = _text.split(/(\#)/g);
    const hashtags = _text.match(hashtagRegex);

    const lastHashtag = last(hashtags)?.replace('#', '');
    const lastWord = last(words);
    if (lastWord !== lastHashtag) return undefined;
    return lastWord;
  };

  useEffect(() => {
    const unsub = inputStream.subscribe(({ text, cursorPos }) => {
      const hashtag = getHashtag(text, cursorPos);
      if (hashtag) {
        connectionStream.next(
          connectionStream.value.copyWith({ connectionState: ConnectionState.waiting, hashtag }),
        );
      } else {
        connectionStream.next(
          connectionStream.value.copyWith({ connectionState: ConnectionState.none }),
        );
      }
    });

    const connectionStreamSub = connectionStream.subscribe(snapshot => {
      if (snapshot.connectionState === ConnectionState.waiting) {
        requestStream.next(snapshot.hashtag);
      }
      if (snapshot.connectionState === ConnectionState.hasData) {
        setData(snapshot.data!);
      }
      setConnectionState(snapshot.connectionState);
    });

    const requestStreamSub = requestStream.pipe(debounceTime(500)).subscribe(async hashtag => {
      // ...if receving data recheck with current hashtag in [connectionStreamSub]
      // ...if matched push new event to [connectionStreamSub]
      // ...ortherwhise doing nothing
      const shouldCancel = () => {
        return (
          hashtag !== connectionStream.value.hashtag ||
          connectionStream.value.connectionState !== ConnectionState.waiting
        );
      };
      try {
        const data = await searchHashtag(hashtag);
        if (shouldCancel()) {
          return;
        }
        connectionStream.next(
          connectionStream.value.copyWith({
            connectionState: isEmpty(data) ? ConnectionState.hasEmptyData : ConnectionState.hasData,
            data,
          }),
        );
      } catch (e) {
        if (shouldCancel()) {
          return;
        }
        connectionStream.next(
          connectionStream.value.copyWith({
            connectionState: ConnectionState.hasError,
            error: e as Error,
          }),
        );
      }
    });

    return () => {
      unsub.unsubscribe();
      requestStreamSub.unsubscribe();
      connectionStreamSub.unsubscribe();
    };
  }, []);

  const onItemPress = (item: string) => {
    appendHashtag(item);
    connectionStream.next(
      connectionStream.value.copyWith({ connectionState: ConnectionState.none }),
    );
  };

  if (connectionState === ConnectionState.waiting) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  } else if (
    connectionState === ConnectionState.hasData ||
    connectionState === ConnectionState.hasEmptyData
  ) {
    return (
      <_List initData={data!} hashtag={connectionStream.value.hashtag} onPress={onItemPress} />
    );
  }
  return <></>;
};

const _List = ({
  onPress,
  initData,
  hashtag,
}: {
  onPress: (value: string) => void;
  initData: PaginationResponse<string>;
  hashtag?: string;
}) => {
  const { results, count, next } = initData;

  const fetch = (next?: string) => {
    if (!hashtag) {
      return {
        results: [],
        count: 0,
      };
    }
    return searchHashtag(hashtag, next);
  };
  const { onScroll, data, state, endReached } = usePagingFetch<string>({
    initialData: results,
    fetch,
    next: initData?.next ?? undefined,
  });

  const renderItem = ({ item, index }) => {
    return (
      <Ripple onPress={() => onPress(item)} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
        <Text style={Typography.name_button}>#{item}</Text>
      </Ripple>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      keyboardShouldPersistTaps={'always'}
      ListEmptyComponent={
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={[Typography.name_button, { color: Colors.surface.darkGray }]}>
            {`Không có hashtag nào trùng với từ khóa\n"${hashtag}"`}
          </Text>
        </View>
      }
      renderItem={renderItem}
      data={data}
      ListFooterComponent={
        !endReached ? (
          <View style={{ paddingVertical: 14, alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : (
          <></>
        )
      }
    />
  );
};
