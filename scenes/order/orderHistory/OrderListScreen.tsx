import { UpIcon } from 'assets/icons';
import { EmptyView } from 'components/empty/EmptyView';
import OrderBox from 'components/list/order/OrderBox';
import { range } from 'lodash';
import { OrderItem } from 'model';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Fade, Placeholder } from 'rn-placeholder';
import { Colors, Outlines, Spacing } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { OrderListBoxPlaceholder } from './OrderListBoxPlaceholder';
import { getOrderListApi } from '_api';
import { OrderStatus, OrderStatusContentMap } from 'scenes/order/orderHistory/type';
import { useRoute } from '@react-navigation/native';
import { Header } from 'components/header/Header';
import { screen } from 'styles/spacing';
import { getHeaderLayout } from '_helper';

const OrderListScreen = () => {
  const count = 20;
  const [data, setData] = useState([]);

  const {
    params: { status },
  } = useRoute() as { params: { status: OrderStatus } };

  const { empty, text } = useMemo(() => {
    return OrderStatusContentMap[status];
  }, [status]);

  const flatListRef = useRef(null);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDataEnd, setIsDataEnd] = useState(false);
  const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
  const [offset, setOffset] = useState(20);
  useEffect(() => {
    _fetchMoreData(true);
  }, []);

  const _fetchMoreData = async (recreate = false) => {
    if (!inProgressNetworkReq) {
      setInProgressNetworkReq(true);
      const { data: newData, totalCount } = await getOrderListApi({
        offset: recreate ? 0 : offset,
        order_status: status,
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

  const _rowRenderer = ({ item, index }: { item: OrderItem; index: number }) => {
    return (
      <View style={{ marginBottom: index === data.length - 1 ? 84 : 0 }}>
        <OrderBox status={status} data={item} />
      </View>
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
      <View style={styles.emptyContainer}>
        <EmptyView
          title={'Bạn chưa có đơn hàng'}
          titleStyle={{ textTransform: 'none' }}
          description={'Hãy cùng mua sắm với Dabi nhé!'}
          descriptionStyle={{ marginTop: 6 }}
          file={empty}
        />
      </View>
    );
  }, []);

  const onRefresh = async () => {
    setIsDataEnd(false);
    await _fetchMoreData(true);
  };

  const onGotoTop = () => {
    flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header title={text} />
      </SafeAreaView>
      {isFirstLoad ? (
        <_Placeholder />
      ) : (
        <>
          <FlatList
            contentContainerStyle={{...data.length <= 0 ? { flex: 1 } : undefined}}
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={_rowRenderer}
            onEndReached={handleListEnd}
            onEndReachedThreshold={0.05}
            ListEmptyComponent={_renderEmpty}
            ListFooterComponent={_renderFooter}
            keyExtractor={(item: any) => `${item.pk}`}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
          {data.length > 0 ? (
            <View style={styles.upIconContainer}>
              <TouchableOpacity onPress={onGotoTop} style={{ alignItems: 'center' }}>
                <View style={[styles.buttonContainer]}>
                  <UpIcon />
                </View>
              </TouchableOpacity>
            </View>
          ) : undefined}
        </>
      )}
    </View>
  );
};

const _Placeholder = () => {
  return (
    <View>
      <Placeholder Animation={Fade}>
        <View style={{ paddingHorizontal: 16 }}>
          {range(3).map((_, index) => {
            return <OrderListBoxPlaceholder key={index} />;
          })}
        </View>
      </Placeholder>
    </View>
  );
};

export default React.memo(OrderListScreen);
const headerHeight = getHeaderLayout().height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
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
});
