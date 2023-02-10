import { DabiFont } from 'assets/icons';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import { FeatureMeasurement } from 'components/tutorial';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { HashtagList } from 'scenes/feed/HashTagRecommendList';
import { Colors, Typography } from 'styles';
import { colorList, patternList, styleList } from 'utils/data/filter';
import { toPriceFormat } from '_helper';
import FilterModalContext, {
  CategoryContext,
  CategoryRepoContext,
  FilterRepoContext,
  OrderingContext,
  OrderingRepoContext,
} from './context';
import { FilterModalRouteMap } from './modal';
import { FilterModalRoute } from './types.d';

const colorFriendlyName: { [key: string]: string } = {};
const patternFriendlyName: { [key: string]: string } = {};
const styleFriendlyName: { [key: string]: string } = {};

colorList.map(({ key, description }) => {
  colorFriendlyName[key] = description;
});

patternList.map(({ key, description }) => {
  patternFriendlyName[key] = description;
});

styleList.map(({ key, description }) => {
  styleFriendlyName[key] = description;
});

const FilterBtnGroup = () => {
  const { repo } = useContext(FilterRepoContext);
  const { patternFilter, colorFilter, styleFilter, priceFilter, isDiscount } = repo;

  const genButtonMetadata = useCallback(() => {
    const buttons: { [id: number]: ButtonMetadata } = {};
    for (const route of Object.values(FilterModalRoute)) {
      buttons[route as FilterModalRoute] = getButtonMetadata(route as FilterModalRoute);
    }

    return buttons;
  }, []);

  const { open } = useContext(FilterModalContext);

  const [buttonMetadata, setButtonMetadata] = useState<{ [id: number]: ButtonMetadata }>(
    genButtonMetadata(),
  );

  useEffect(() => {
    const buttonMeta = buttonMetadata[FilterModalRoute.color];
    const applied = !isEmpty(colorFilter);
    buttonMeta.applied = applied;
    if (applied) {
      const name = colorFriendlyName[colorFilter[0]];
      buttonMeta.appliedName = name + (colorFilter.length > 1 ? ` +${colorFilter.length - 1}` : '');
    }

    setMeta(FilterModalRoute.color, buttonMeta);
  }, [colorFilter]);

  useEffect(() => {
    const buttonMeta = buttonMetadata[FilterModalRoute.pattern];
    const applied = !isEmpty(patternFilter);
    buttonMeta.applied = applied;
    if (applied) {
      const name = patternFriendlyName[patternFilter[0]];
      buttonMeta.appliedName =
        name + (patternFilter.length > 1 ? ` +${patternFilter.length - 1}` : '');
    }

    setMeta(FilterModalRoute.pattern, buttonMeta);
  }, [patternFilter]);

  useEffect(() => {
    const hasPriceFilter = !!(priceFilter[0] > 0 || priceFilter[1]);
    const applied = hasPriceFilter || isDiscount;
    const buttonMeta = buttonMetadata[FilterModalRoute.price];
    buttonMeta.applied = applied;
    if (isDiscount && !hasPriceFilter) {
      buttonMeta.appliedName = 'Có khuyến mãi';
    } else if (hasPriceFilter) {
      buttonMeta.appliedName = `${toPriceFormat(priceFilter[0])}~${priceFilter[1] ? toPriceFormat(priceFilter[1]) : ''
        }`;
    }
    setMeta(FilterModalRoute.price, buttonMeta);
  }, [priceFilter, isDiscount]);

  useEffect(() => {
    const applied = !isEmpty(styleFilter);
    const buttonMeta = buttonMetadata[FilterModalRoute.style];
    buttonMeta.applied = applied;
    if (applied) {
      const name = styleFriendlyName[styleFilter[0]];
      buttonMeta.appliedName = name + (styleFilter.length > 1 ? ` +${styleFilter.length - 1}` : '');
    }
    setMeta(FilterModalRoute.style, buttonMeta);
  }, [styleFilter]);

  const setMeta = (route: FilterModalRoute, meta: ButtonMetadata) => {
    setButtonMetadata({
      ...buttonMetadata,
      [route]: meta,
    });
  };

  return (
    <View style={{ height: 28 }}>
      {/* <_FeatureDiscoveryAnchor /> */}
      <ScrollView
        contentContainerStyle={{ paddingLeft: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {Object.keys(FilterModalRouteMap).map(route => {
          const index = Number.parseInt(route, 10);
          const meta = buttonMetadata[index];
          const { applied } = meta;
          const onPress = () => open(index);

          return (
            <View key={`${route}`} style={{ marginRight: 12 }}>
              <Ripple onPress={onPress}>
                <View style={{ backgroundColor: applied ? Colors.black : Colors.background, borderRadius: 14, paddingVertical: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...Typography.body, color: applied ? Colors.white : Colors.black }}>{meta.name}</Text>
                  <View style={{ width: 4 }} />
                  {!applied && <DabiFont name='small_arrow_right' size={12} />}</View>
              </Ripple>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const _FeatureDiscoveryAnchor = () => {
  return (
    <View
      style={{
        position: 'absolute',
        width: 68,
        height: 28,
        left: 16,
      }}>
      <FeatureMeasurement
        id={'productlist_filter'}
        title={'Tìm sản phẩm theo điều kiện'}
        description={
          'Bạn có thể tìm sản phẩm theo điều kiện mà bạn mong muốn, ví dụ: giá, Màu, kích cỡ...'
        }
        backgroundColor={Colors.purple}
        overlay={
          <View style={{ width: 68, height: 28 }}>
            <Button
              text={'Giá'}
              color={Colors.button}
              type={ButtonType.outlined}
              constraint={LayoutConstraint.wrapChild}
              textStyle={{ color: Colors.text }}
              onPress={() => { }}
              iconColor={Colors.text}
              postfixIcon={'small_arrow_right'}
            />
          </View>
        }>
        <View style={{ width: 68, height: 28 }} />
      </FeatureMeasurement>
    </View>
  );
};

class ButtonMetadata {
  defaultName: string;
  appliedName: string;
  applied?: boolean;

  constructor({ name, appliedName }: { appliedName?: string; name: string }) {
    this.defaultName = name;
    this.appliedName = appliedName ?? '';
  }

  get name(): string {
    return this.applied ? this.appliedName : this.defaultName;
  }
}

const getButtonMetadata = (route: FilterModalRoute): ButtonMetadata => {
  const name = FilterModalRouteMap[route];

  return new ButtonMetadata({ name });
};

export const CategoryBtn = () => {
  const { toogle } = useContext(CategoryContext);
  const { repo } = useContext(CategoryRepoContext);
  const { category, subCategory } = repo;

  return (
    <FeatureMeasurement
      id={'category_filter'}
      title={'Bạn có thể xem các danh mục khác chỉ bằng 1 bước nhỏ 😉'}
      description={'Không cần phải quay về, bạn có thể thay đổi danh mục ngay lập tức!'}
      backgroundColor={Colors.green}
      overlay={
        <View style={{ paddingLeft: 0 }}>
          <Button
            innerHorizontalPadding={0}
            type={ButtonType.flat}
            constraint={LayoutConstraint.wrapChild}
            postfixIcon={'small_arrow_down'}
            textStyle={Typography.title}
            text={subCategory.name === 'all' ? category.display_name : subCategory.display_name}
            onPress={toogle}
          />
        </View>
      }>
      <Button
        innerHorizontalPadding={0}
        type={ButtonType.flat}
        constraint={LayoutConstraint.wrapChild}
        postfixIcon={'small_arrow_down'}
        textStyle={Typography.title}
        text={subCategory.name === 'all' ? category.display_name : subCategory.display_name}
        onPress={toogle}
      />
    </FeatureMeasurement>
  );
};

export const OrderingBtn = () => {
  const { toogle } = useContext(OrderingContext);
  const { repo } = useContext(OrderingRepoContext);

  return (
    <Button
      text={repo.description}
      color={Colors.button}
      type={ButtonType.flat}
      constraint={LayoutConstraint.wrapChild}
      textStyle={{ textTransform: 'none', ...Typography.mark, color: Colors.component, }}
      onPress={toogle}
      iconColor={Colors.text}
    />
  );
};

export default FilterBtnGroup;
