import { InfiniteScrollList } from 'components/list/InfiniteScrollList';
import { ListController } from 'components/list/ListController';
import { RenderProps } from 'components/list/RenderProps';
import { get, isNil, range, toLength } from 'lodash';
import { ProductInfo } from 'model/product/product';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Fade, Placeholder } from 'rn-placeholder';
import { getProductList } from 'services/api/product/product.api';
import { ProductListDTO, ProductListFilterInterface } from 'services/api/product/product.dtos';
import { Spacing } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { EmptyView, GenericErrorView } from '../../empty/EmptyView';
import { ProductFilter, useFilterModal } from './filter';
import { CategoryRepoContext, FilterRepoContext, OrderingRepoContext } from './filter/context';
import { ConnectionState } from 'utils/hooks/useAsync';
import ProductBox from './ProductBox';
import { ProductBoxPlaceholder, ProductBoxPlaceholderRow } from './ProductBox';

type ProductInfoRow = [ProductInfo, ProductInfo | undefined];

const _Product = ({
  fetch,
  refresh,
  controller,
  HeaderComponent,
  fixedHeaderComponent,
  showScrollToTopBtn = true,
  stopFetchConditon = infData => false,
  customItemBuilder,
  renderAheadMultiply,
}: {
  fetch: (offset: number) => Promise<ProductInfo[]>;
  refresh?: (data?: any) => void;
  initialData?: ProductInfo[];
  controller?: ListController<ProductInfoRow>;
  HeaderComponent?: JSX.Element;
  fixedHeaderComponent?: JSX.Element;
  stopFetchConditon?: (infData: any[]) => boolean;
  customItemBuilder?: UseElementBuilderProps;
  renderAheadMultiply?: number;
  showScrollToTopBtn?: boolean;
}) => {
  const filter = useFilterModal();
  const [visible, setVisible] = useState(false);
  const [orderingVisible, setOrderingVisible] = useState(false);
  const fetchOffset = useRef(0);

  const toogleCategoryModal = () => {
    setVisible(!visible);
  };
  const toogleOrderingModal = () => {
    setOrderingVisible(!orderingVisible);
  };

  const categoryContext = useMemo(
    () => ({
      visible,
      toogle: toogleCategoryModal,
    }),
    [visible],
  );

  const orderingContext = useMemo(
    () => ({
      visible: orderingVisible,
      toogle: toogleOrderingModal,
    }),
    [orderingVisible],
  );

  const _fetch = async (reset?: boolean, infFetch?: boolean): Promise<ProductInfoRow[]> => {
    try {
      if (reset) {
        fetchOffset.current = 0;
      }
      const result = await fetch(fetchOffset.current);

      fetchOffset.current += toLength(result.length);

      return listToMatrix(result, 2) as ProductInfoRow[];
    } catch (error) {
      throw error;
    }
  };

  const onRefresh = () => {
    refresh && refresh();
    return _fetch(true);
  };

  const { itemRender, infRender } = useElementBuilder(customItemBuilder);

  return (
    <ProductFilter.FilterContext.Provider value={filter}>
      <ProductFilter.CategoryContext.Provider value={categoryContext}>
        <ProductFilter.OrderingContext.Provider value={orderingContext}>
          <View style={{ flex: 1 }}>
            {fixedHeaderComponent ?? <></>}
            <InfiniteScrollList<ProductInfoRow>
              showScrollToTopBtn={showScrollToTopBtn}
              stopFetchConditon={stopFetchConditon}
              fetch={_fetch}
              Header={HeaderComponent}
              // initialData={_initialData}
              refresh={onRefresh}
              infFetch={() => _fetch(false, true)}
              infRender={infRender}
              item={itemRender}
              controller={controller}
              renderAheadMultiply={renderAheadMultiply}
            />
          </View>
          <ProductFilter.OrderingModal />
          <ProductFilter.Modal />
          <ProductFilter.CategoryDrawer />
        </ProductFilter.OrderingContext.Provider>
      </ProductFilter.CategoryContext.Provider>
    </ProductFilter.FilterContext.Provider>
  );
};

interface UseElementBuilderProps {
  HasEmptyDataView?: JSX.Element;
}

const useElementBuilder = (
  props?: UseElementBuilderProps,
): {
  itemRender: RenderProps<ProductInfoRow>;
  infRender: (state: ConnectionState) => JSX.Element;
} => {
  const { HasEmptyDataView } = props ?? {};
  const width = Spacing.screen.width;
  const itemWidth = (width - 16 * 2 - 12) / 2;

  const imageHeight = (itemWidth * 5) / 4; // image thumb with 4:5 ratio
  const infoHeight = 73; // Height of the product name + shop + price
  const itemHeight = imageHeight + infoHeight;

  const paddingVertical = 18 * 2; // 18 for top & bottom => 36 between each item

  const height = itemHeight + paddingVertical;

  const itemRender = useMemo(() => {
    return new RenderProps<ProductInfoRow>({
      getTypeByData: () => 'item',
      builder: {
        none: dimension => {
          return (
            <Placeholder Animation={Fade}>
              <View style={{ marginBottom: 18 }}>
                {range(3).map((_, index) => {
                  return (
                    <View
                      key={index}
                      style={[{ height: height, width: dimension.width }, styles.itemContainer]}>
                      <View style={{ width: itemWidth, height: itemHeight }}>
                        <ProductBoxPlaceholder />
                      </View>
                      <View style={{ width: 12 }} />
                      <View style={{ width: itemWidth, height: itemHeight }}>
                        <ProductBoxPlaceholder />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Placeholder>
          );
        },
        hasData: (dimension, data, _) => {
          return (
            <View
              style={[{ height: dimension.height, width: dimension.width }, styles.itemContainer]}>
              {data && (
                <>
                  <View style={{ width: itemWidth, height: itemHeight }}>
                    <ProductBox key={`${data[0].pk}`} data={data[0]} />
                  </View>
                  <View style={{ width: 12 }} />
                  {!isNil(data[1]) ? (
                    <View style={{ width: itemWidth, height: itemHeight }}>
                      <ProductBox key={`${data[1].pk}`} data={data[1]} />
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </View>
          );
        },
        hasEmptyData: () => {
          if (HasEmptyDataView) return HasEmptyDataView;

          return (
            <EmptyView
              title={'Không tìm thấy kết quả'}
              description={'Vui lòng kiểm tra lại bộ lọc của bạn'}
              // tslint:disable-next-line: no-unsafe-any
              file={require('assets/images/empty/info_product.png')}
            />
          );
        },
        hasError: () => {
          return <GenericErrorView />;
        },
      },
      dimension: { item: { height, width } },
    });
  }, []);

  const infRender = (state: ConnectionState) => {
    if (state === ConnectionState.waiting) {
      return (
        <Placeholder Animation={Fade}>
          <View style={{ marginBottom: 12 }}>
            {range(3).map((_, index) => {
              return (
                <View key={index} style={[{ height, width }, styles.itemContainer]}>
                  <ProductBoxPlaceholderRow />
                </View>
              );
            })}
          </View>
        </Placeholder>
      );
    }
    return <></>;
  };

  return {
    itemRender,
    infRender,
  };
};

const useHandler = (
  additionalFilter?: ProductListFilterInterface,
  fetchFunc?: (params: ProductListFilterInterface) => Promise<ProductListDTO>,
  onFetchDone?: () => void,
): {
  controller: ListController<ProductInfoRow>;
  fetch: (offset: number) => Promise<ProductInfo[]>;
  count: number;
} => {
  const { resetFilter } = useActions();
  const { repo: orderingType } = useContext(OrderingRepoContext);
  const { category, subCategory } = useContext(CategoryRepoContext).repo;
  const { patternFilter, colorFilter, styleFilter, priceFilter, isDiscount } =
    useContext(FilterRepoContext).repo;

  const [totalCount, setTotalCount] = useState(0);

  const filter: ProductListFilterInterface = useMemo(
    () => ({
      patternFilter,
      colorFilter,
      styleFilter,
      priceFilter,
      categoryFilter: category.name,
      subCategoryFilter: subCategory.name,
      ordering: orderingType.key,
      isDiscount,
      ...additionalFilter,
    }),
    [
      patternFilter,
      colorFilter,
      styleFilter,
      priceFilter,
      category,
      subCategory,
      orderingType.key,
      isDiscount,
      additionalFilter,
    ],
  );

  const prevFilter = useRef<ProductListFilterInterface | undefined>(
    additionalFilter ? { ...filter, ...additionalFilter } : undefined,
  );

  const initialized = useRef(false);

  const controller = useMemo(() => new ListController<ProductInfoRow>(), []);

  const fetch = async (offset: number): Promise<ProductInfo[]> => {
    try {
      let products;
      const params: ProductListFilterInterface = {
        ...filter,
        ...additionalFilter,
        offset,
      };
      if (fetchFunc) {
        products = await fetchFunc(params);
      } else {
        products = await getProductList(params);
      }
      initialized.current = true;
      setTotalCount(products.totalCount);

      return products.data;
    } catch (error) {
      throw error;
    } finally {
      if (onFetchDone) onFetchDone();
    }
  };

  useEffect(() => {
    return () => {
      resetFilter();
    };
  }, []);

  const hasSameFilter = (
    old: ProductListFilterInterface | undefined,
    current: ProductListFilterInterface,
  ) => {
    if (isNil(old)) return false;
    return (
      old.categoryFilter === current.categoryFilter &&
      old.subCategoryFilter === current.subCategoryFilter &&
      listHasSameItem(old.patternFilter ?? [], current.patternFilter ?? []) &&
      listHasSameItem(old.colorFilter ?? [], current.colorFilter ?? []) &&
      listHasSameItem(old.styleFilter ?? [], current.styleFilter ?? []) &&
      get(old, 'priceFilter[0]', 0) === get(current, 'priceFilter[0]', 0) &&
      get(old, 'priceFilter[1]', 0) === get(current, 'priceFilter[1]', 0) &&
      old.ordering === current.ordering &&
      old.offset === current.offset &&
      old.isDiscount === current.isDiscount &&
      old.storePk === current.storePk &&
      old.query === current.query &&
      old.personalization === current.personalization &&
      old.isDiscount === current.isDiscount
    );
  };

  useEffect(() => {
    if (!initialized.current || hasSameFilter(prevFilter?.current, filter)) return;
    controller.refresh();
    prevFilter.current = filter;
  }, [filter]);

  return {
    controller,
    fetch,
    count: totalCount,
  };
};

export const List = {
  Product: memo(_Product),
  useHandler,
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});

const listToMatrix = <T extends any>(list: T[], elementsPerSubArray: number) => {
  const matrix: T[][] = [];
  let i, k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    matrix[k].push(list[i]);
  }

  return matrix;
};

export const listHasSameItem = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;

  return a.every(value => {
    return b.indexOf(value) > -1;
  });
};
