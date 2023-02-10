import { ConnectionDetection } from 'components/empty/OfflineView';
import { ListController } from 'components/list/ListController';
import { FeedbackList, FeedbackListRef, Layout } from 'components/list/post/FeedbackList.v2';
import { FeedFilter, useFilterModal } from 'components/list/post/filter';
import { FeedFilterRepoContext } from 'components/list/post/filter/context';
import { isNil } from 'lodash';
import { FeedbackInfo } from 'model';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import { Colors, Outlines, Typography } from 'styles';
import { FeedbackOrdering, FeedListFilterInterface, feedStream, getFeedbackListV2 } from '_api';

export const FeedTab = () => {
  const listRef = useRef<FeedbackListRef>();

  useEffect(() => {
    const subscription = feedStream.subscribe(_ => {
      listRef?.current?.refresh();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ConnectionDetection.View>
        <FeedbackList
          Header={<_Header />}
          showScrollToTopBtn={true}
          floatingButtonBottomMargin={24}
          layout={Layout.grid}
          renderAheadMultiply={1}
          ref={listRef}
        />
        {/* <View style={{ position: 'absolute', bottom: 24, right: 16 }}>
          <IconButton
            onPress={() => {
              navigator.navigate(new FeedCreatingRouteSetting());
            }}
            size={48}
            iconSize={24}
            backgroundColor={Colors.primary}
            color={'white'}
            icon={'edit'}
          />
        </View> */}
      </ConnectionDetection.View>
    </View>
  );
};

const _Header = () => {
  return (
    <View style={{ width: '100%' }}>
      <View style={{ height: 12 }} />
      <FeedFilter.ActionGroup />
      <View style={{ height: 12 }} />
      {/* <_followingSection /> */}
      <View style={{
        paddingBottom: 12, alignItems: 'flex-end',
      }}>
        <View>
          <FeedFilter.OrderingBtn /></View>
      </View>
    </View>
  );
}

const _followingSection = () => {
  return <View>
    <Text style={Typography.body}>If you want to match KOL having same size with you? Let's start it</Text>
  </View>
}

