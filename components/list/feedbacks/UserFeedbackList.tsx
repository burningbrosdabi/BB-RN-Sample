import { UpIcon } from 'assets/icons';
import { EmptyView } from 'components/empty/EmptyView';
import UserFeedbackBox from 'components/list/feedbacks/UserFeedbackBox';
import { range } from 'lodash';
import { UserFeedbackItem } from 'model';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Fade, Placeholder } from 'rn-placeholder';
import { UserFeedbacksDTO } from 'services/api/user/user.feedbacks.dtos';
import { Colors, Outlines, Spacing } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { UserFeedbackItemPlaceholder } from './UserFeedbackItemPlaceholder';


interface UserFeedbackListProps {
  fetchData: (props: any) => Promise<UserFeedbacksDTO>;
  count?: number;
  renderHeader?: any;
}

const UserFeedbackList = forwardRef((props: UserFeedbackListProps, ref) => {
  const { fetchData, count = 20, renderHeader } = props;
  const flatListRef = useRef(null);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [data, setData] = useState<UserFeedbackItem[]>([]);
  const [isDataEnd, setIsDataEnd] = useState(false);
  const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
  const [offset, setOffset] = useState(count);

  useImperativeHandle(ref, () => ({
    refresh(filter: any) {
      _fetchMoreData(true, filter);
    }
  }));

  useEffect(() => {
    _fetchMoreData(true);
  }, []);

  const _fetchMoreData = async (recreate = false, filter?: any) => {
    if (!inProgressNetworkReq) {
      setInProgressNetworkReq(true);
      const { data: newData, totalCount } = await fetchData({
        offset: recreate ? 0 : offset,
        ...filter,
      });
      setInProgressNetworkReq(false);
      if (totalCount <= count || offset >= totalCount) {
        setIsDataEnd(true);
      }
      if (recreate) {
        isFirstLoad && setIsFirstLoad(false);
        setData(newData);
        setOffset(count);
      } else {
        const newList = getUniqueListBy(data.concat(newData), 'pk');
        setData(newList);
        setOffset(offset + count);
      }
    }
  };

  const handleListEnd = async () => {
    if (!isDataEnd) {
      await _fetchMoreData();
    }
  };

  const _rowRenderer = ({ item, index }: { item: UserFeedbackItem, index: number }) => {
    return (
      <UserFeedbackBox
        data={item}
        style={index == data.length - 1 ? { borderBottomWidth: 0, marginBottom: 84 } : {}}
        index={index}
      />
    );
  };

  const _renderFooter = () => {
    return isDataEnd ? (
      <></>
    ) : (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 40,
        }}>
        <ActivityIndicator color={Colors.surface.midGray} />
      </View>
    );
  };

  const _renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyView}>
        <EmptyView
          title={'Không có đánh giá'}
          titleStyle={{ marginTop: 4 }}
          description={'Bạn chưa đanh giá sản phẩm nào'}
          descriptionStyle={{ marginTop: 4 }}
          file={require('_assets/images/icon/no_user_feedbacks.png')}
        />
      </View>
    );
  }, []);

  const onRefresh = async () => {
    setIsDataEnd(false)
    await _fetchMoreData(true)
  };

  const onGotoTop = () => {
    flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
  };

  if (isFirstLoad) {
    return <_Placeholder />
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={_rowRenderer}
        onEndReached={handleListEnd}
        onEndReachedThreshold={0.05}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={_renderEmpty}
        ListFooterComponent={_renderFooter}
        keyExtractor={(item: any) => `${item.pk}`}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
      />
      {data.length > 0 ?
        <View style={styles.upIconContainer}>
          <TouchableOpacity
            onPress={onGotoTop}
            style={{ alignItems: 'center' }}>
            <View style={[styles.buttonContainer]}>
              <UpIcon />
            </View>
          </TouchableOpacity>
        </View> : undefined}
    </View>
  );
});

const _Placeholder = () => {
  return (
    <View>
      <Placeholder Animation={Fade}>
        <View>
          {range(3).map((_, index) => {
            return <UserFeedbackItemPlaceholder key={index} />;
          })}
        </View>
      </Placeholder>
    </View>
  );
};

export default React.memo(UserFeedbackList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 8,
    zIndex: 500,
    backgroundColor: theme.WHITE,
    borderWidth: Outlines.borderWidth.base,
    borderColor: theme.LIGHT_GRAY,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    borderRadius: 50,
  },
  upIconContainer: {
    zIndex: 1000,
    position: 'absolute',
    bottom: theme.MARGIN_20,
    right: theme.MARGIN_20,
    alignItems: 'center',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.screen.height - 220 * Spacing.AUTH_RATIO_H - getStatusBarHeight(),
  },
});
