import { List } from 'components/list/product/ProductList.v2';
import { RenderProps } from 'components/list/RenderProps';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { RelatedProductProps } from 'routes/product/relatedProduct.route';
import { Spacing, Typography } from 'styles';
import { Header } from 'components/header/Header';

export const RelatedProductScreen = ({ route }: { route: { params: RelatedProductProps } }) => {
  const { fetchFunc } = route.params;

  const { controller, fetch } = List.useHandler({ isDiscount: true }, fetchFunc);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <Header title={'Sản phẩm gợi ý'} />
      </SafeAreaView>
      <List.Product fetch={fetch} controller={controller} />
    </View>
  );
};
