import { EmptyView } from 'components/empty/EmptyView';
import { List } from 'components/list/product/ProductList.v2';
import ProductListHorizontal, {
  ProductListHorizontalPlaceholder,
} from 'components/list/product/ProductListHorizontal';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { FavoriteWatchedProductRouteSetting } from 'routes/favorite/watchedProduct.route';
import { NavigationService } from 'services/navigation';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { getUserFavoriteProducts, getUserWatchedProducts, productWatchedStream } from '_api';
import { Typography } from '_styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';

const ProductTab = () => {
  const { controller, fetch } = List.useHandler(undefined, getUserFavoriteProducts);

  return (
    <List.Product
      controller={controller}
      fetch={fetch}
      HeaderComponent={<_WatchedProducts />}
      customItemBuilder={{
        HasEmptyDataView: (
          <EmptyView
            title={'Hãy thả tym'}
            titleStyle={{ marginTop: 4 }}
            description={'Bạn sẽ thấy những sản phẩm\nmà bạn đã thích'}
            descriptionStyle={{ marginTop: 4 }}
            file={require('_assets/images/empty/info_product.png')}
          />
        ),
      }}
    />
  );
};

const _WatchedProducts = () => {
  const { excecute, data, refresh, state } = useAsync(() => getUserWatchedProducts({ offset: 0 }), {
    emptyDataLogical: data => isEmpty(data.data),
  });

  useEffect(() => {
    excecute();
    const sub = productWatchedStream.subscribe(() => {
      refresh();
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const onShowMore = () => {
    NavigationService.instance.navigate(new FavoriteWatchedProductRouteSetting());
  };

  if (state === ConnectionState.waiting) {
    return (
      <View style={{ marginTop: 12 }}>
        <ProductListHorizontalPlaceholder />
      </View>
    );
  }

  if (state === ConnectionState.hasData) {
    return (
      <View style={{ marginTop: 12 }}>
        <ProductListHorizontal
          simple
          data={data.data}
          title={'Sản phẩm xem gần đây'}
          containerStyle={{
            marginTop: 0,
            marginBottom: 12,
          }}
          showMore={onShowMore}
        />
        <Text style={{ marginLeft: 16, ...Typography.name_button }}>Sản phẩm mà bạn yêu thích</Text>
      </View>
    );
  }
  return <></>;
};

export default React.memo(ProductTab);
