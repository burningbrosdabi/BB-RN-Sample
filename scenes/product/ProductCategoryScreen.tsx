import { DabiFont } from 'assets/icons';
import { isEmpty, range } from 'lodash';
import ProductCategory from 'model/product/product.category';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageRequireSource, ScrollView, StyleSheet,
  Text,
  View
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { ProductCategoryFilterRouteSetting } from 'routes/product/productCategoryFilter.route';
import { SearchResultRouteSetting, SearchRouteSetting } from 'routes/search/search.route';
import { getHotHashtag } from 'services/api/search/search.api';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { CategoryEnum } from 'utils/data';
import { getHeaderLayout } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { loadCategory } from 'utils/state/action-creators/product.action-creators';

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

export interface CategoryListRef {
  refresh: () => Promise<any>;
}

export const ProductCategoryScreen = () => {
  const { resetStoreFilter } = useActions();
  const [hashTagList, setHashTagList] = useState([])
  const fetch = async () => {
    const data = loadCategory();
    if (isEmpty(data)) return {};

    const results: { [key in CategoryEnum]?: ProductCategory } = {};

    data.forEach(category => {
      if (!iconMap[category.name as CategoryEnum]) return;
      results[category.name as CategoryEnum] = category;
    });

    return results;
  };
  const { data, excecute, state } = useAsync(fetch);

  useEffect(() => {
    excecute();
    const hashTags = async () => {
      const hotHashtags = await getHotHashtag()
      setHashTagList(hotHashtags)
    }
    hashTags()
  }, []);

  const navigator = useNavigator();


  const _renderItem = ({ item, index }) => {
    const [key, source] = item;
    const category = data && data[key as CategoryEnum];
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
      <Ripple
        key={key}
        onPress={onPress}
        style={{
          ...styles.itemContainer,
        }}>
        <Image source={source} style={styles.imageContainer} />
        <Text style={Typography.description}>{category.display_name}</Text>
      </Ripple>
    );
  };

  const _renderHashtag = (item: string) => {
    return (
      <Ripple
        style={{
          backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 8, borderRadius: 14
        }}
        onPress={() => {
          resetStoreFilter && resetStoreFilter();
          navigator.navigate(new SearchResultRouteSetting({ query: item }))
        }}
        key={item}
      >
        <Text style={Typography.body}>#{item}</Text>
      </Ripple>
    );
  };

  if (state === ConnectionState.hasEmptyData || state === ConnectionState.hasError) return <></>;
  if (state === ConnectionState.waiting || state === ConnectionState.none) return <_PlaceHolder />;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginTop: getHeaderLayout().extra + 12,
          marginBottom: 12
        }}>
        <Ripple
          style={{
            height: 40, flex: 1
          }}
          rippleContainerBorderRadius={20}
          onPress={() => {
            resetStoreFilter && resetStoreFilter();
            navigator.navigate(new SearchRouteSetting());
          }}>
          <View style={{
            flexDirection: 'row',
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: Colors.background,
            justifyContent: 'space-between',
            flex: 1,
          }}>
            <Text style={{
              ...Typography.body,
              textAlignVertical: 'center',
            }}>Bạn muốn tìm gì?</Text>
            <DabiFont name={'search_line'} size={24} color={Colors.icon} />
          </View>
        </Ripple>

      </View>
      <ScrollView>
        <View>
          <View style={{ marginVertical: 12, paddingLeft: 16, flex: 1, }}>
            <Text style={Typography.title}>Hot hashtag</Text>
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {hashTagList.map((item) => { return _renderHashtag(item) })}
            </View>
          </View>
          <View style={{ marginVertical: 12, paddingLeft: 16 }}>
            <Text style={Typography.title}>Danh mục</Text>
          </View>
          <FlatList
            style={{ paddingHorizontal: 16, }}
            refreshing={false}
            data={Object.entries(iconMap)}
            numColumns={5}
            renderItem={_renderItem}
            columnWrapperStyle={{ justifyContent: 'space-between', }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View >
  );
};

const _PlaceHolder = () => {
  return (
    <Placeholder Animation={Fade}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginTop: getHeaderLayout().extra + 12,
          marginBottom: 12
        }}>
        <Ripple
          style={{
            height: 40, flex: 1
          }}
          rippleContainerBorderRadius={20}
          onPress={() => {
          }}>
          <View style={{
            flexDirection: 'row',
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 20,
            alignItems: 'center',
            backgroundColor: Colors.background,
            justifyContent: 'space-between',
            flex: 1,
          }}>
            <Text style={{
              ...Typography.body,
              textAlignVertical: 'center',
            }}>Bạn muốn tìm gì?</Text>
            <DabiFont name={'search_line'} size={24} color={Colors.icon} />
          </View>
        </Ripple>

      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 24 }} />
        <PlaceholderLine noMargin style={{ height: 18, width: 200 }} />
        <View style={{ height: 24 }} />
        {range(3).map((_, index) => {
          return (
            <View style={{ flexDirection: 'row', paddingBottom: 12 }} key={index}>
              <PlaceholderMedia style={{ height: 52, flex: 1, borderRadius: 8 }} />
            </View>
          );
        })}
      </View>
      <View style={{ height: 24 }} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 24 }} />
        <PlaceholderLine noMargin style={{ height: 18, width: 200 }} />
        <View style={{ height: 24 }} />
        {range(3).map((_, index) => {
          return (
            <View style={{ flexDirection: 'row', paddingBottom: 12 }} key={index}>
              <PlaceholderMedia style={{ height: 20, flex: 1, borderRadius: 8 }} />
            </View>
          );
        })}
      </View>
    </Placeholder>
  );
};


const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 12,
  },
  imageContainer: { width: 52, height: 52 },
});

export default ProductCategoryScreen;
