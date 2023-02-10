import { useRoute } from '@react-navigation/native';
import { Animation } from 'components/animation';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { ProductFilter } from 'components/list/product/filter';
import { OrderingRepoContext } from 'components/list/product/filter/context';
import { List } from 'components/list/product/ProductList.v2';
import { HandledError } from 'error';
import { get } from 'lodash';
import { StoreAddress, StoreInfo } from 'model';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import StoreProfileSquare, { StoreProfilePlaceholder } from 'scenes/store/StoreProfileSquare';
import { Colors, Outlines, Typography } from 'styles';
import { productOrderingList } from 'utils/data';
import { numberWithDots } from 'utils/helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getStoreAddress, getStoreDetail } from '_api';
import { StoreParams } from 'routes/store/store.route';
import { RoutePath } from 'routes';
import { useGetPreviousRoute } from 'utils/hooks/useGetPreviousRoute';
import { Completer } from 'services/remote.config';

const StoreDetailScreen = () => {
  const [animationValue] = useState(new Animated.Value(0));
  const { update } = useContext(OrderingRepoContext);
  const [title, setTitle] = useState(undefined);
  const orderingAppliedCompleter = useRef(new Completer()).current;

  const { state, excecute } = useAsync(() => orderingAppliedCompleter.promise);

  const route = useRoute();
  const { pk, store, ordering } = get(route, 'params', {
    store: {},
    ordering: 'recommend',
  }) as StoreParams;
  const id = pk ?? store?.pk;

  useEffect(() => {
    excecute();
    if (ordering === 'new_product') {
      update(productOrderingList[1]);
    }
    orderingAppliedCompleter.complete(undefined);
  }, []);

  const { controller, fetch, count } = List.useHandler({ storePk: id });

  controller.onScroll = data => {
    if (data.nativeEvent.contentOffset.y < 0) return;
    Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: animationValue,
          },
        },
      },
    ])(data);
  };

  const _fetch = async (offset: number) => {
    return fetch(offset);
  };

  return (
    <ConnectionDetection.View>
      <>
        <Animation.Header title={title ?? ''} animation={animationValue} />
        {(state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) && (
          <List.Product
            controller={controller}
            fetch={_fetch}
            HeaderComponent={<_Header setTitle={setTitle} id={id} count={count} />}
          />
        )}
      </>
    </ConnectionDetection.View>
  );
};

const _Header = ({
  setTitle,
  id,
  count,
}: {
  setTitle: (title: string) => {};
  id: number;
  count: number;
}) => {
  const previous = useGetPreviousRoute();

  const fetch = (): Promise<[StoreInfo, StoreAddress[]]> => {
    const is_search_result = previous === RoutePath.searchRecommend;

    return Promise.all([
      getStoreDetail(id, { is_search_result }).catch(error => {
        new HandledError({
          error: Error(`Store ${id}: failed to get store's detail`),
          stack: 'StoreDetailScreen._Header.getStoreDetail',
        }).log(true);
        throw error;
      }),
      getStoreAddress(id).catch(error => {
        new HandledError({
          error: Error(`Store ${id}: failed to get store's address`),
          stack: 'StoreDetailScreen._Header.getStoreAddress',
        }).log(true);

        return [];
      }),
    ]);
  };
  const { excecute, data, state, error } = useAsync<[StoreInfo, StoreAddress[]]>(fetch);

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    if (data && data[0]) {
      setTitle(data[0].insta_id);
    }
  }, [data]);

  return (
    <View>
      {state === ConnectionState.waiting && <StoreProfilePlaceholder />}
      {state === ConnectionState.hasData && (
        <StoreProfileSquare data={data![0]} address={data![1]} />
      )}
      {state === ConnectionState.hasError && <View style={{ height: 36 }} />}
      <View style={{ height: 12 }} />
      <View style={{ marginLeft: 16 }}>
        <ProductFilter.CategoryBtn />
      </View>
      <View style={{ height: 12 }} />
      <ProductFilter.ActionGroup />
      <View
        style={{
          borderBottomWidth: Outlines.borderWidth.base,
          borderBottomColor: Colors.line,
          marginTop: 12,
          marginBottom: 11,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
        <ProductFilter.OrderingBtn />
      </View>
    </View>
  );
};
export default ProductFilter.HOC(StoreDetailScreen);
