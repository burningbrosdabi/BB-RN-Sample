import { useNavigation } from '@react-navigation/native';
import CommentInput from 'components/comment/CommentInput';
import { CommentList } from 'components/comment/CommentList';
import { ConnectionDetection } from 'components/empty/OfflineView';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { CommentItemModel } from 'model';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { CommentListScreenProps } from 'routes';
import { Subject } from 'rxjs';
import { HEADER_HEIGHT } from '_helper';
import { CommentContext, CommentReplyContext } from 'components/comment/context';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

const CommentListScreen = ({ route }: { route: { params: CommentListScreenProps } }) => {
  const navigation = useNavigation();
  const commentStream = useRef(new Subject<CommentItemModel>()).current;
  const replyStream = useRef(new Subject<CommentItemModel>()).current;
  const sourceCommentStream = useRef(
    new BehaviorSubject<CommentItemModel | undefined>(undefined),
  ).current;

  const { pk, type } = route.params;
  const onBack = () => {
    navigation.goBack();
  };

  return (
    <CommentContext.Provider value={{ commentStream }}>
      <CommentReplyContext.Provider value={{ replyStream, sourceCommentStream }}>
        <ConnectionDetection.View>
          <SafeAreaWithHeader
            onBack={onBack}
            title={'Tất cả bình luận'}
            titleStyle={{ marginRight: 24 }}>
            <View
              style={{
                flex: 1,
                paddingTop: HEADER_HEIGHT,
              }}>
              <CommentList pk={pk} type={type} />
            </View>
            <CommentInput pk={pk} type={type} />
          </SafeAreaWithHeader>
        </ConnectionDetection.View>
      </CommentReplyContext.Provider>
    </CommentContext.Provider>
  );
};

export default CommentListScreen;
