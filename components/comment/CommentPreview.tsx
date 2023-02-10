import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getFeedbackComments } from '_api';
import { Link } from 'components/button/Link';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { isEmpty, range } from 'lodash';
import { useNavigator } from 'services/navigation/navigation.service';
import { CommentListRouteSetting } from 'routes';
import { CommentItemModel, CommentType } from 'model';
import { useNavigation } from '@react-navigation/native';
import { Subject } from 'rxjs';
import { EmptyView } from 'components/empty/EmptyView';
import { CommentItemPlaceholder } from './CommentItemPlaceholder';
import { CommentItem } from './CommentItem';
import { Colors, Typography } from 'styles';
import { CommentContext } from 'components/comment/context';
import { DabiFont } from 'assets/icons';
import Ripple from 'react-native-material-ripple';

type Props = {
  pk: number;
  type?: CommentType;
  countIncludedSub?: number;
  showAll?: boolean
};

export const CommentPreview = ({ countIncludedSub, pk, type = CommentType.feed, showAll = true }: Props) => {
  const { data, excecute, state, refresh } = useAsync(
    () => getFeedbackComments({ pk, limit: 2, type }),
    {
      emptyDataLogical: ({ results }) => isEmpty(results),
    },
  );

  const navigation = useNavigation();
  const { commentStream: stream } = useContext(CommentContext);

  const { results: comments } = data ?? {};
  const [count, setCount] = useState(countIncludedSub ?? 0);

  useEffect(() => {
    excecute();
    const unsub = navigation.addListener('focus', () => {
      refresh();
    });

    const subscription = stream?.subscribe({
      next: () => {
        refresh();
        setCount(curr => curr + 1);
      },
    });

    return () => {
      unsub();
      subscription?.unsubscribe();
    };
  }, []);

  const navigator = useNavigator();

  const showAllComments = () => {
    navigator.navigate(
      new CommentListRouteSetting({
        pk,
        type,
      }),
    );
  };

  if (state === ConnectionState.hasEmptyData) {
    return <View style={{ paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', paddingLeft: 16, alignItems: 'flex-end' }}>
        <Text style={Typography.subtitle}>Bình luận </Text>
        <View style={{ width: 8 }} />
        <Text style={{ ...Typography.body, color: Colors.component }}>{count}</Text>
      </View>
      <View style={{ height: 12 }} /><ShowAllCommentsButton showAllComments={showAllComments} /></View>
  }
  if (state === ConnectionState.waiting) {
    return <_Placeholder />;
  } else if (state === ConnectionState.hasData) {
    return (
      <View style={{ paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', paddingLeft: 16, alignItems: 'flex-end' }}>
          <Text style={Typography.name_button}>Bình luận </Text>
          <View style={{ width: 8 }} />
          <Text style={{ ...Typography.body, color: Colors.component }}>{count}</Text>
        </View>
        <View style={{ height: 24 }} />
        {comments!.slice(0, 2).map(comment => {
          return (
            <View key={comment.pk}>
              <CommentItem type={type} onTextPressed={showAllComments} comment={comment!} />
            </View>
          );
        })}
        {/* {count! >= 3 && (
          <View style={{ alignSelf: 'flex-start' }}>
            <Link
              horizontalPadding={16}
              style={{ textDecorationLine: 'none' }}
              onPress={showAllComments}
              text={`Xem tất cả ${count} bình luận`}
            />
            <View style={{ height: 12 }} />
          </View>
        )} */}
        {showAll ? <ShowAllCommentsButton showAllComments={showAllComments} /> : <></>}
      </View>
    );
  }
  return <></>;
};

const _Placeholder = () => (
  <Placeholder Animation={Fade}>
    <PlaceholderLine style={{ height: 16, width: 180, marginLeft: 16, backgroundColor: 'white' }} />
    <View style={{ height: 12 }} />
    {range(2).map((_, index) => {
      return (
        <View key={`${index}`}>
          <CommentItemPlaceholder />
        </View>
      );
    })}
  </Placeholder>
);

export const ShowAllCommentsButton = ({ showAllComments }: { showAllComments?: () => void }) => (
  <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
    <Ripple rippleContainerBorderRadius={20} onPress={showAllComments}>
      <View style={{
        backgroundColor: Colors.background, flexDirection: 'row', alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20
      }}><DabiFont name={'camera'} />
        <View style={{ width: 12 }} />
        <Text style={{ flex: 1 }}>Thêm bình luận...</Text>
        <DabiFont name={'send'} /><View style={{ width: 12 }} />
      </View></Ripple>
  </View>
);
