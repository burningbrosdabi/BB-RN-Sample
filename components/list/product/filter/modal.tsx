import { toast } from 'components/alert/toast';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import IconButton from 'components/button/IconButton';
import OrderList from 'components/list/order/OrderList';
import { isEmpty } from 'lodash';
import { ProductCategory, ProductSubcategory } from 'model';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabBarItem,
  TabView
} from 'react-native-tab-view';
import { fontExtraBold } from 'styles/typography';
import {
  colorList,
  OrderingInterface,
  patternList,
  productOrderingList,
  styleList
} from 'utils/data';
import { useActions } from 'utils/hooks/useActions';
import { loadCategory } from 'utils/state/action-creators/product.action-creators';
// styles
import { Colors, Outlines, Spacing, Typography } from '_styles';
import ProductSubCategoryList from '../ProductSubCategoryList';
import FilterContext, {
  CategoryContext,
  CategoryRepoContext,
  FilterRepoContext,
  OrderingContext,
  OrderingRepoContext
} from './context';
import FilterList from './FilterList';
import PriceFilter, { PriceFilterRef } from './PriceFilter';
import { FilterModalRoute, IFilterModalContext } from './types.d';

type AnimatedModalTabBarRoute = Route & {
  modalHeight: number;
  key: string;
  title: string;
};

export const FilterModalRouteMap: { [id: number]: string } = {
  [FilterModalRoute.price]: 'Giá',
  [FilterModalRoute.color]: 'Màu',
  [FilterModalRoute.pattern]: 'Mẫu',
  [FilterModalRoute.style]: 'Phong cách',
};

export interface ModalProps {
  route?: FilterModalRoute;
  visible: boolean;
}

const ProductFilter = () => {
  const { repo, update: setFilter } = useContext(FilterRepoContext);
  const { patternFilter, colorFilter, styleFilter, priceFilter, isDiscount: isDiscountFilter } = repo;

  const { value, close } = useContext<IFilterModalContext>(FilterContext);
  const { route: routeIndex, visible } = value;
  const { showDialog } = useActions();

  const [price, setPrice] = useState(priceFilter);
  const [style, setStyle] = useState(styleFilter);
  const [color, setColor] = useState(colorFilter);
  const [pattern, setPattern] = useState(patternFilter);
  const [isDiscount, setIsDiscount] = useState(isDiscountFilter);

  const modalizeRef = useRef<Modalize>(null);
  const [index, setIndex] = useState(0);
  const priceFilterRef = useRef<PriceFilterRef>();
  const [routes] = useState<AnimatedModalTabBarRoute[]>([
    // Header Height : 108
    {
      key: 'price',
      title: 'Giá',
      modalHeight: 158 + 46 + 24, // 82
    },
    {
      key: 'color',
      title: 'Màu',
      modalHeight: 218,
    },
    {
      key: 'pattern',
      title: 'Mẫu',
      modalHeight: 144,
    },
    {
      key: 'style',
      title: 'Phong cách',
      modalHeight: 166,
    },
  ]);

  useEffect(() => {
    (routeIndex || routeIndex == 0) && setIndex(routeIndex);
  }, [routeIndex]);

  useEffect(() => {
    if (visible) {
      setIndex(routeIndex ?? 0);
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const renderScene = ({ route }: { route: AnimatedModalTabBarRoute }) => {
    switch (route.key) {
      case 'price':
        return (
          <PriceFilter
            initialPrice={price}
            ref={priceFilterRef}
            initialIsDiscount={isDiscount}
            setPrice={setPrice}
            setIsDiscount={setIsDiscount}
          />
        );
      case 'color':
        return <FilterList filterList={colorList} filter={color} setFilter={setColor} />;
      case 'pattern':
        return <FilterList filterList={patternList} filter={pattern} setFilter={setPattern} />;
      case 'style':
        return (
          <FilterList
            filterList={styleList}
            filter={style}
            setFilter={setStyle}
            buttonType="text"
          />
        );
      default:
        return <View />;
    }
  };

  const _onClose = () => {
    setPrice(priceFilter);
    setStyle(styleFilter);
    setColor(colorFilter);
    setPattern(patternFilter);
    setIndex(index => routeIndex);
  };

  const _removeAll = () => {
    showDialog({
      title: 'Bạn muốn xóa bộ lọc??',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Xóa',
          onPress: () => {
            priceFilterRef.current?.reset();
            setPrice([0, null]);
            setStyle([]);
            setColor([]);
            setPattern([]);
            setIsDiscount(false)
          },
        },
        {
          text: 'Không',
          type: ButtonType.flat,
          onPress: () => { },
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };
  const renderTabBarItem = props => {
    const { route, navigationState } = props;
    const { routes, index } = navigationState;
    const isSelected = route.key == routes[index].key;
    const labelStyle = isSelected ? { ...Typography.name_button } : { ...Typography.body };
    const borderStyle = isSelected
      ? { borderBottomWidth: 2, borderColor: Colors.primary }
      : undefined;
    return (
      <View style={{ ...borderStyle, marginRight: 24 }}>
        <TabBarItem
          {...props}
          key={route.key}
          labelStyle={{ ...labelStyle, textTransform: 'capitalize' }}
        />
      </View>
    );
  };

  const renderTabBar = useCallback(
    <T extends Route>(
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
      },
    ) => {
      const onTabItemPress = (value: number) => setIndex(value);

      return (
        <TabBar
          {...props}
          activeColor={Colors.primary}
          inactiveColor={Colors.text}
          index
          tabStyle={{ width: 'auto', paddingHorizontal: 0, paddingTop: 24, paddingBottom: 12 }}
          indicatorStyle={{ backgroundColor: Colors.primary, height: 0, marginRight: 24 }}
          style={{
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: Outlines.borderWidth.base,
            borderBottomColor: Colors.line,
            paddingLeft: 16,
          }}
          onTabItemPress={onTabItemPress}
          renderTabBarItem={renderTabBarItem}
        />
      );
    },
    [index],
  );

  const _applyFilter = () => {
    setFilter({
      styleFilter: style,
      colorFilter: color,
      patternFilter: pattern,
      priceFilter: price,
      isDiscount,
    });
    modalizeRef.current?.close();
    if (
      !isEmpty(style) ||
      !isEmpty(color) ||
      !isEmpty(pattern) ||
      !isEmpty(price[0]) ||
      !isEmpty(price[1])
    ) {
      toast('Áp dụng bộ lọc');
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        panGestureEnabled={index !== 0}
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        onClosed={() => {
          _onClose();
          close();
        }}
        HeaderComponent={() => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 24,
              }}>
              <View style={{ position: 'absolute', left: 16 }}>
                <Button
                  text="Cài đặt lại"
                  type={ButtonType.flat}
                  onPress={_removeAll}
                  constraint={LayoutConstraint.wrapChild}
                  textStyle={{ ...Typography.description, color: Colors.primary }}
                  innerHorizontalPadding={0}
                />
              </View>
              <Text style={Typography.title}>Bộ lọc</Text>
              <View style={{ position: 'absolute', right: 16 }}>
                <IconButton
                  icon={'close'}
                  onPress={() => {
                    _onClose();
                    modalizeRef.current?.close();
                  }}
                />
              </View>
            </View>
          );
        }}
        FooterComponent={
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}>
            <Button text="ÁP DỤNG" type={ButtonType.primary} onPress={_applyFilter} />
          </View>
        }
        adjustToContentHeight
        withHandle={false}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          swipeEnabled={index !== 0}
          onIndexChange={setIndex}
          initialLayout={{ width: Spacing.screen.width }}
          sceneContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 16,
            height: routes[index].modalHeight + 24 * 2,
          }}
          renderTabBar={renderTabBar}
          lazy
        />
      </Modalize>
    </Portal>
  );
};

export const CategoryDrawer = () => {
  const modalizeRef = useRef<Modalize>(null);
  const { repo: categoryFilter, update } = useContext(CategoryRepoContext);
  const [category, setCategory] = useState<string | null>(categoryFilter?.category?.name);

  // const { state, data: categories, excecute } = useAsync(loadCategory);
  let categories = loadCategory();

  if (!isEmpty(categories)) {
    categories = [
      categories!.find(item => item.name === categoryFilter.category.name) as ProductCategory,
      ...categories!.filter(item => item.name !== categoryFilter.category.name),
    ];
  }
  const { visible, toogle } = useContext(CategoryContext);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const onPress = (subCategory: ProductSubcategory, item: ProductCategory) => {
    update({ category: item, subCategory });
    modalizeRef.current?.close();
  };

  const _renderCategory = (item: ProductCategory, index: number) => {
    const isSelected = category === item.name;
    const newData = item.productsubcategory_set;

    return (
      <View key={index}>
        <View>
          <Button
            type={ButtonType.flat}
            alignItems={'flex-start'}
            constraint={LayoutConstraint.matchParent}
            postfixIcon={isSelected ? 'small_arrow_up' : 'small_arrow_down'}
            text={item.display_name}
            onPress={() => (isSelected ? setCategory(null) : setCategory(item.name))}
            textStyle={{ fontFamily: fontExtraBold }}
            innerHorizontalPadding={24}
          />
        </View>
        {isSelected && (
          <ProductSubCategoryList
            key={`${index}-${item.name}`}
            data={newData}
            selectedSubCategory={categoryFilter.subCategory}
            handleOnPress={(subCategory: ProductSubcategory) => onPress(subCategory, item)}
          />
        )}
      </View>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        onClosed={toogle}
        HeaderComponent={() => {
          return <View style={{ height: 12 }} />;
        }}
        withHandle={false}>
        <View>
          {categories!.map((item, index) => {
            return _renderCategory(item, index);
          })}
        </View>
      </Modalize>
    </Portal>
  );
};

export const OrderingModal = () => {
  const modalizeRef = useRef<Modalize>(null);
  const orderingContext = useContext(OrderingContext);
  const { visible, toogle } = orderingContext;
  const orederingRepoContext = useContext(OrderingRepoContext);
  const { repo, update } = orederingRepoContext;

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const _applyOrdering = (orderingType: OrderingInterface) => {
    update(orderingType);
    modalizeRef.current?.close();
  };

  const _renderHeader = () => {
    return <View style={{ height: 22 }} />;
  };

  return (
    <Portal>
      <OrderingRepoContext.Provider value={orederingRepoContext}>
        <Modalize
          ref={modalizeRef}
          panGestureEnabled
          rootStyle={{ zIndex: 10, elevation: 10 }}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          onClose={toogle}
          HeaderComponent={_renderHeader}
          adjustToContentHeight
          withHandle={false}>
          <OrderList orderList={productOrderingList} orderingType={repo} onPress={_applyOrdering} />
        </Modalize>
      </OrderingRepoContext.Provider>
    </Portal>
  );
};

export default ProductFilter;
