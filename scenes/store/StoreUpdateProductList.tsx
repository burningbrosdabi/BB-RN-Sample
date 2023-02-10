import { ProductBox } from 'components/list/product/ProductBox';
import React from 'react';
import { FlatList, View } from 'react-native';
import { ProductDetailRouteSetting } from 'routes';
import { NavigationService } from 'services/navigation';
import { Spacing } from 'styles';

// image height + marginTop + storename + name + price_marginTop + price + marginBottom
const width = (Spacing.screen.width - 16 * 2 - 12) / 2;
export const ITEM_HEIGHT = (width / 4) * 5 + 8 + 16 + 20 + 4 + 22 + 12

const StoreUpdateProductList = ({ data }: { data: any[] }) => {
  const _rowRenderer = ({ item, index }: { item: any, index: number }) => {
    const paddingLeft = index % 2 == 0 ? 16 : 12;
    const handleOnPress = () => {
      const routeSetting = new ProductDetailRouteSetting({ productPk: item.pk });
      NavigationService.instance.navigate(routeSetting);
    };

    return (
      <View style={{ paddingLeft, paddingBottom: 36 - 12 /** 36 - ProductBox paddingBottom */ }}>
        <ProductBox data={item} handleOnPress={handleOnPress} />
      </View>
    );
  };

  const _keyExtractor = (item: any) => `${item.pk}${item.name}`

  const _renderFooter = () => {
    return null
  }

  return (
    <View>
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={_rowRenderer}
        keyExtractor={_keyExtractor}
        ListFooterComponent={_renderFooter}
      />
    </View>
  );
}

export default React.memo(StoreUpdateProductList);