import { ProductFilter } from 'components/list/product/filter';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { NavigationService } from 'services/navigation';
import { FeedbackOrdering, getFeedbackListV2, getStores, getStoreSearchList, getUserList, StoreListFilter } from '_api';
// component
import { Colors, Outlines, Spacing, Typography } from '_styles';
import { List } from 'components/list/product/ProductList.v2';
import { List as _List } from 'components/list/store/StoreList.v2';
import { numberWithDots } from 'utils/helper';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { get, isNil } from 'lodash';
import BackButton from 'components/header/BackButton';
import { useNavigator } from 'services/navigation/navigation.service';
import { SearchRouteSetting } from 'routes/search/search.route';
import { RoutePath } from 'routes';
import { useGetPreviousRoute } from 'utils/hooks/useGetPreviousRoute';
import { CategoryRepoContext, defaultCatg } from 'components/list/product/filter/context';
import { loadCategory } from 'utils/state/action-creators/product.action-creators';
import { Completer } from 'services/remote.config';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { PaginationFetch } from 'services/http/type';
import { StoreListItem } from 'model';
import { EmptyView } from 'components/empty/EmptyView';
import { FeedbackList } from 'components/list/post/FeedbackList.v2';
import { UserList } from 'components/list/user/UserList'


const _Screen = () => {
  const { params } = useRoute();

  const query = get(params, 'query', '');
  const fetchCatgCompleter = useRef(new Completer()).current;

  const { state, excecute } = useAsync(() => fetchCatgCompleter.promise);

  const categoryFilter = useMemo(() => {
    // @ts-ignore
    if (!params?.subCategory && !params?.category) {
      return undefined;
    }
    // @ts-ignore
    const { subCategory: subCategoryParam, category: categoryParam } = params;
    const categories = loadCategory();

    const category = categories.find(catg => catg.name === categoryParam) ?? defaultCatg;
    const subCategory =
      category?.productsubcategory_set?.find(catg => catg.name === subCategoryParam) ?? defaultCatg;

    return {
      category,
      subCategory,
    };
  }, []);

  const navigator = useNavigator();

  const currentTab = NavigationService.instance.currentTab;
  const [index, setIndex] = useState(currentTab === 'Store' ? 1 : 0);
  const [routes] = useState<Route[]>([
    { key: 'feed', title: 'Feed' },
    { key: 'user', title: 'User' },
    { key: 'product', title: 'Sản phẩm' },
    // { key: 'store', title: 'Cửa hàng' },
  ]);

  const navRoutes = useNavigationState(state => state.routes);

  const { update, repo } = useContext(CategoryRepoContext);

  useEffect(() => {
    excecute();
    if (categoryFilter) {
      update(categoryFilter);
    }
    fetchCatgCompleter.complete(undefined);
    return;
  }, [categoryFilter]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'feed':
        return <FeedTab query={query} />
      case 'user':
        return <UserTab query={query} />;
      case 'product':
        return <MemoProductTab enableCategory={!isNil(categoryFilter)} query={query} />;
      case 'store':
        return <StoreTab query={query} />;
      default:
        return null;
    }
  };

  const renderTabBar = useCallback(
    <T extends Route>(
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
      },
    ) => {
      const onTabItemPress = (value: number) => setIndex(value);

      return <TabBar
        indicatorStyle={{ backgroundColor: Colors.black }}
        style={{ backgroundColor: Colors.white, elevation: 0, shadowOpacity: 0, }}
        renderLabel={({ route, focused }) => (
          <Text style={Typography.name_button}>{route.title}</Text>
        )}
        {...props}
      />;
    },
    [index],
  );

  const previousRoute = useGetPreviousRoute();

  const onSearch = () => {
    if (previousRoute && previousRoute === RoutePath.searchRecommend) {
      navigator.goBack();
    } else {
      navigator.navigate(new SearchRouteSetting({ query }), true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <BackButton leftPadding={0} />
          <TouchableWithoutFeedback onPress={onSearch}>
            <View style={{
              height: 40,
              borderRadius: 20,
              flex: 1,
              backgroundColor: Colors.background,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center'
            }}>

              <Text numberOfLines={1} style={[Typography.body, { flex: 1 }]}>
                {query}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
      {(state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Spacing.screen.width }}
          renderTabBar={renderTabBar}
          lazy
        />
      )}
    </View>
  );
};


const FeedTab = ({ query }: { query: string }) => {
  const fetch = (next?: string) => {
    return getFeedbackListV2(next, {
      ordering: FeedbackOrdering.recent,
      hashtags: query
    });
  };

  return <FeedbackList
    showScrollToTopBtn={false}
    floatingButtonBottomMargin={24 + 48 /*CreatingFeed (Margin + height)*/ + 24}
    renderAheadMultiply={1}
    fetch={fetch}
  />
}

const UserTab = ({ query }: { query: string }) => {


  return <UserList
    query={query}
  />
}


const ProductTab = ({ query, enableCategory }: { query: string; enableCategory: boolean }) => {
  const { controller, fetch, count } = List.useHandler(enableCategory ? undefined : { query });

  return (
    <View style={{ flex: 1 }}>
      <List.Product
        fetch={fetch}
        controller={controller}
        HeaderComponent={<_Header count={count} />}
      />
    </View>
  );
};

const _Header = ({ count }: { count: number }) => {
  return (
    <View style={{ paddingTop: 12 }}>
      {/*<View style={{ paddingLeft: 16, paddingBottom: 12 }}>*/}
      {/*  <ProductFilter.CategoryBtn />*/}
      {/*</View>*/}
      <ProductFilter.ActionGroup />
      <View style={{ height: 12 }} />
      <View style={styles.orderingTab}>
        <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
        <ProductFilter.OrderingBtn />
      </View>
    </View>
  );
};

const MemoProductTab = React.memo(ProductTab);

const StoreTab = ({ query }: { query: string }) => {
  const fetch: PaginationFetch<StoreListItem, StoreListFilter> = async (next, filter) => {
    return getStores(next, {
      ...filter,
      query,
    });
  };

  return <_List.Store fetch={fetch} Empty={<_EmptyStoreTab />} />;
};

const _EmptyStoreTab = () => (
  <EmptyView
    file={require('assets/images/empty/info_post.png')}
    title={'Không tìm thấy kết quả'}
    description={'Vui lòng kiểm tra lại bộ lọc của bạn'}
  />
);

const styles = StyleSheet.create({
  searchScreenContainer: { paddingHorizontal: 12 },
  searchBarContainer: { marginVertical: 12 * 2 },
  titleText: {
    ...Typography.h1,
    marginBottom: 12 * 2,
    marginTop: 12 * 3,
    paddingHorizontal: 12,
  },
  orderingTab: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 4,
    paddingTop: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: Outlines.borderRadius.base,
    alignItems: 'center',
    height: 32,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  searchBoxInputField: {
    ...Typography.body,
    color: Colors.surface.darkGray,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
});

export const SearchResultScreen = ProductFilter.HOC(_Screen);
