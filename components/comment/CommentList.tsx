import React, { useContext, useEffect, useState } from 'react';
import { CommentItemModel, CommentType } from 'model';
import { PaginationFetch, PaginationResponse } from 'services/http/type';
import { getFeedbackComments } from '_api';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Subject } from 'rxjs';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { Fade, Placeholder } from 'rn-placeholder';
import { range } from 'lodash';
import { CommentItemPlaceholder } from './CommentItemPlaceholder';
import { CommentItem } from './CommentItem';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { CommentContext } from 'components/comment/context';
import { Colors } from 'styles';

type Props = {
  pk: number;
  type: CommentType;
};

export const CommentList = ({ pk, type }: Props) => {
  const fetch: PaginationFetch<CommentItemModel> = (_url?: string) => {
    const url = _url;
    return getFeedbackComments({ url, pk, type });
  };

  const { data, state, excecute } = useAsync(fetch, {
    emptyDataLogical: data => data.results.length < 0,
  });

  useEffect(() => {
    excecute();
  }, []);

  if (state === ConnectionState.waiting) {
    return (
      <Placeholder Animation={Fade}>
        {range(20).map((_, index) => (
          <View key={`${index}`}>
            <CommentItemPlaceholder />
          </View>
        ))}
      </Placeholder>
    );
  }
  if (state !== ConnectionState.hasData) return <></>;
  return <_List type={type} fetch={fetch} initData={data!} />;
};

const _List = ({
  initData,
  fetch,
  type,
}: {
  fetch: PaginationFetch<CommentItemModel>;
  initData: PaginationResponse<CommentItemModel>;
  type: CommentType;
}) => {
  const [data, setData] = useState<CommentItemModel[]>(initData?.results);
  const { commentStream: stream } = useContext(CommentContext);

  const {
    onScroll,
    data: _data,
    state,
    endReached,
  } = usePagingFetch<CommentItemModel>({
    initialData: initData?.results,
    fetch,
    next: initData?.next ?? undefined,
  });

  useEffect(() => {
    setData(_data);
  }, [_data]);

  useEffect(() => {
    const subscription = stream?.subscribe({
      next: value => {
        data.unshift(value);
        setData([...data]);
      },
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, [data]);

  const keyExtractor = (item: CommentItemModel) => {
    return `${item.pk}`;
  };

  const itemBuilder = ({ item, index }: { item: CommentItemModel; index: number }) => {
    return <CommentItem type={type} key={`${item.pk}_${index}`} comment={item} />;
  };

  return (
    <KeyboardAwareFlatList
      style={{ flex: 1 }}
      contentContainerStyle={data.length <= 0 ? { flex: 1 } : undefined}
      onScroll={onScroll}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={itemBuilder}
      ListEmptyComponent={<EmptyView file={require('assets/images/empty/info_follow.png')}
        title={'Chưa có bình luận '}
        description={"Hãy trở thành người đầu tiên bình\nluận bài viết này nhé!"} />}
      ListHeaderComponent={<View style={{ height: 12 }} />}
      ListFooterComponent={
        <View>
          {!endReached && (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator color={Colors.surface.midGray} />
            </View>
          )}
          <View style={{ height: 92 }} />
        </View>
        // !endReached
      }
    />
  );
};
