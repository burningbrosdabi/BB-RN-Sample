import { isEmpty, range } from 'lodash';
import ProductCategory from 'model/product/product.category';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Image, ImageRequireSource, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { ProductCategoryFilterRouteSetting } from 'routes/product/productCategoryFilter.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { loadCategory } from 'utils/state/action-creators/product.action-creators';
import {CategoryEnum} from "utils/data";



const iconMap: { [key in CategoryEnum]: ImageRequireSource } = {
  [CategoryEnum.top]: require('/assets/images/category/icons/category_icon_top.png'),
  [CategoryEnum.skirt]: require('/assets/images/category/icons/category_icon_skirt.png'),
  [CategoryEnum.pants]: require('/assets/images/category/icons/category_icon_pants.png'),
  [CategoryEnum.dress]: require('/assets/images/category/icons/category_icon_dress.png'),
  [CategoryEnum.set]: require('/assets/images/category/icons/category_icon_set.png'),
  [CategoryEnum.outwear]: require('/assets/images/category/icons/category_icon_jacket.png'),
  [CategoryEnum.jewelry]: require('/assets/images/category/icons/category_icon_acc.png'),
  [CategoryEnum.bag]: require('/assets/images/category/icons/category_icon_bag.png'),
  [CategoryEnum.shoes]: require('/assets/images/category/icons/category_icon_shoes.png'),
  [CategoryEnum.cap]: require('/assets/images/category/icons/category_icon_hat.png'),
  [CategoryEnum.underwear]: require('/assets/images/category/icons/category_icon_underwear.png'),
};

export interface HorizontalCategoryListRef {
  refresh: () => Promise<any>;
}

export const HorizontalCategoryList = forwardRef((_, ref) => {
  useImperativeHandle<unknown, HorizontalCategoryListRef>(
    ref,
    () => ({
      refresh: excecute,
    }),
    [],
  );

  const fetch = async () => {
    const data =  loadCategory();
    if (isEmpty(data)) return {};

    const results: { [key in CategoryEnum]?: ProductCategory } = {};

    data.forEach((category) => {
      if (!iconMap[category.name as CategoryEnum]) return;
      results[category.name as CategoryEnum] = category;
    });

    return results;
  };
  const { data, excecute, state } = useAsync(fetch);

  useEffect(() => {
    excecute();
  }, []);

  const navigator = useNavigator();

  if (state === ConnectionState.hasEmptyData || state === ConnectionState.hasError) return <></>;
  if (state === ConnectionState.waiting) return <_PlaceHolder />;
  return (
    <ScrollView
      horizontal
      style={{ paddingVertical: 12, paddingHorizontal: 4 }}
      showsHorizontalScrollIndicator={false}>
      {data &&
        Object.entries(iconMap).map(([key, source]) => {
          const category = data[key as CategoryEnum];
          if (!category) return <></>;
          const onPress = () => {
            if (!category) return;
            const routeSetting = new ProductCategoryFilterRouteSetting({
              subCategory: 'all',
              category: category.name,
            });
            navigator.navigate(routeSetting);
          };

          return (
            <Ripple key={key} onPress={onPress} style={styles.itemContainer}>
              <Image source={source} style={styles.imageContainer} />
              <View style={{ height: 4 }} />
              <Text style={Typography.description}>{category.display_name}</Text>
            </Ripple>
          );
        })}
    </ScrollView>
  );
});

const _PlaceHolder = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={{ flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 4 }}>
        {range(5).map((_, index) => (
          <ItemPlaceholder key={`${index}`} />
        ))}
      </View>
    </Placeholder>
  );
};

const ItemPlaceholder = () => {
  return (
    <View style={styles.itemContainer}>
      <PlaceholderMedia
        style={[
          styles.imageContainer,
          {
            borderRadius: 2,
            backgroundColor: Colors.surface.white,
          },
        ]}
      />
      <View style={{ height: 4 }} />
      <PlaceholderLine
        noMargin
        style={{ width: 52, height: 16, backgroundColor: Colors.surface.white }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 12,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: { width: 52, height: 52 },
});
