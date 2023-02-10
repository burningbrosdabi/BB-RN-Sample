import { UpIcon } from 'assets/icons';
import { EmptyView } from 'components/empty/EmptyView';
import ProductFeedbackItem from 'components/list/feedbacks/ProductFeedbackItem';
import { range } from 'lodash';
import { ProductUserFeedbackItem } from 'model';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Fade, Placeholder } from 'rn-placeholder';
import { ProductUserFeedbacksDTO } from 'services/api/product/product.feedbacks.dtos';
import { Colors, Outlines, Spacing } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { ProductFeedbackItemPlaceholder } from './ProductFeedbackItemPlaceholder';

interface ProductFeedbackListProps {
  initData?: ProductUserFeedbackItem[];
  fetchData: (props: any) => Promise<ProductUserFeedbacksDTO>;
  count?: number;
  renderHeader?: any;
  emptyViewStyle?: ViewStyle;
  fullDescription?: boolean;
}

const ProductFeedbackList = forwardRef((props: ProductFeedbackListProps, ref) => {
  const { fetchData, count = 20, renderHeader, initData, emptyViewStyle, fullDescription = false } = props;
  const flatListRef = useRef(null);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [data, setData] = useState<ProductUserFeedbackItem[]>(initData || []);
  const [isDataEnd, setIsDataEnd] = useState(!!initData);
  const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
  const [offset, setOffset] = useState(count);
  const [currentFilter, setCurrentFilter] = useState(null);

  useImperativeHandle(ref, () => ({
    refresh(filter: any) {
      _fetchMoreData(true, filter);
      setCurrentFilter(filter);
    }
  }));

  useEffect(() => {
    if (initData) {
      setIsFirstLoad(false);
    } else {
      _fetchMoreData(true);
    }
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
    if (!!initData) return;

    if (!isDataEnd) {
      await _fetchMoreData();
    }
  };

  const _rowRenderer = ({ item, index }: { item: ProductUserFeedbackItem, index: number }) => {
    return (
      <ProductFeedbackItem
        index={index}
        data={item}
        fullDescription={fullDescription}
        style={index == data.length - 1 ? { borderBottomWidth: 0, paddingBottom: fullDescription ? 84 : 0 } : {}}
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
      <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, emptyViewStyle]}>
        <EmptyView
          title={'Chưa có đánh giá nào'}
          titleStyle={{ marginTop: 4 }}
          description={'Hãy trở thành người đầu tiên đánh giá\nsản phẩm này nhé!'}
          descriptionStyle={{ marginTop: 4 }}
          file={require('_assets/images/icon/no_user_feedbacks.png')}
        />
      </View>
    );
  }, []);

  const onRefresh = async () => {
    setIsDataEnd(false)
    await _fetchMoreData(true, currentFilter);
  };

  const onGotoTop = () => {
    flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
  };

  if (isFirstLoad) {
    return <ProductFeedbackListPlaceholder />
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
          !initData ? <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
          /> : undefined
        }
      />
      {(data.length > 0 && !initData) ?
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

export const ProductFeedbackListPlaceholder = () => {
  return (
    <View>
      <Placeholder Animation={Fade}>
        <View>
          {range(3).map((_, index) => {
            return <ProductFeedbackItemPlaceholder key={index} />;
          })}
        </View>
      </Placeholder>
    </View>
  );
};

export default React.memo(ProductFeedbackList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    height: Spacing.screen.height - getStatusBarHeight() - 200,
    justifyContent: 'center',
    alignItems: 'center',
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
});
