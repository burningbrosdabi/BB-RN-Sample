import { Header } from 'components/header/Header';
import { List } from 'components/list/product/ProductList.v2';
import { RenderProps } from 'components/list/RenderProps';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { getUserWatchedProductsList } from 'services/api/user/user.api';
import { Spacing, Typography } from 'styles';
import { numberWithDots } from 'utils/helper';

export const FavoriteWatchedProduct = () => {
  const { controller, fetch, count } = List.useHandler(
    undefined,
    getUserWatchedProductsList,
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <Header title={'Sản phẩm đã xem'} />
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        <List.Product
          fetch={fetch}
          controller={controller}
          HeaderComponent={<View
            style={{
              paddingHorizontal: 16,
            }}>
            <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
          </View>}
        />
      </View>
    </View>
  );
};
