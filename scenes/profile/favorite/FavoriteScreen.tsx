import { useNavigation, useRoute } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { EmptyView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { FeedbackBoxGrid } from 'components/list/post/FeedbackBoxGrid';
import { PlaceholderGrid } from 'components/list/post/FeedbackList.v2';
import { ProductBox, ProductBoxPlaceholderRow } from 'components/list/product/ProductBox';
import { get, isNil, range } from 'lodash';
import { FeedbackInfo, ProductInfo } from 'model';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { } from 'react-native-safe-area-context';
import { NavigationState, Route, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import { Fade, Placeholder } from 'rn-placeholder';
import { getFollowingFeeds, getUserFavoriteProducts } from 'services/api';
import { feedCollectController, productLikeController } from 'services/user';
import { HEADER_HEIGHT, renderLoginAlert } from 'utils/helper';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Colors, Spacing, Typography } from '_styles';


const _UserFeedCollectionTab = () => {
    const { isLoggedIn } = useTypedSelector((state) => state.auth);

    const [feedData, setFeedData] = useState<FeedbackInfo[]>([])
    const [nextURL, setNextURL] = useState(undefined)
    const [isListEnd, setIsListEnd] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const reLoad = () => {
        setFeedData([])
        setNextURL(undefined)
        setIsListEnd(false)
        setIsInitialLoad(true)
        loadMoreFeed(true)
    }

    useEffect(() => {
        if (isLoggedIn) {
            reLoad()
            return
        }
        setFeedData([])
        setNextURL(undefined)
        setIsListEnd(false)
        setIsInitialLoad(true)
    }, [isLoggedIn])

    useEffect(() => {
        const subscription = feedCollectController.nextStream.subscribe(() => {
            reLoad()
        })
        return () => {
            subscription.unsubscribe();
        }
    }, [])



    const loadMoreFeed = async (reload = false) => {
        if (!reload && isListEnd) {
            return
        }
        const { results, count, next } = await getFollowingFeeds(reload ? undefined : (nextURL ?? undefined));

        if (isNil(next)) {
            setNextURL(undefined)
            setIsListEnd(true)
        } else {
            setNextURL(next)
        }
        setFeedData(feedData.concat(results))
        setIsInitialLoad(false)
    }

    useEffect(() => {
        loadMoreFeed()
    }, [])


    const _renderFooter = () => {
        return isListEnd ? <View style={{ height: 50 }} /> : <PlaceholderGrid />
    }

    const _renderFeedEmpty = () => {
        return isInitialLoad ? <PlaceholderGrid /> : <EmptyView
            file={require('/assets/images/empty/info_post.png')}
            title={'Chưa có bài viết nào được lưu'} description='Bạn hãy xem bài viết ở Trang chủ và lưu lại nhé!' />
    }

    const _renderItem = ({ item, index }) => {
        return <View key={`${item.pk}`} style={{
            flex: 1 / 2,
        }}>
            <View style={{
                paddingLeft: index % 2 != 0 ? 4 : 0,
                paddingRight: index % 2 != 0 ? 0 : 4
            }}>
                <FeedbackBoxGrid data={item} />
            </View>
        </View>
    }

    return feedData.length == 0 ? <ScrollView
        contentContainerStyle={{ paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
    >{_renderFeedEmpty()}</ScrollView> : <FlatList
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ paddingBottom: 8 }}
        data={feedData}
        numColumns={2}
        removeClippedSubviews
        initialNumToRender={6}
        ListEmptyComponent={_renderFeedEmpty}
        ListFooterComponent={_renderFooter}
        contentContainerStyle={{ paddingTop: 12 }}
        onEndReached={() => loadMoreFeed(false)}
        onEndReachedThreshold={1}
        renderItem={_renderItem}
    />
}

const _UserRelatedProductTab = () => {
    const { isLoggedIn } = useTypedSelector((state) => state.auth);

    const [productData, setProductData] = useState<ProductInfo[]>([])
    const [nextURL, setNextURL] = useState(undefined)
    const [isListEnd, setIsListEnd] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const reLoad = () => {
        setProductData([])
        setNextURL(undefined)
        setIsListEnd(false)
        setIsInitialLoad(true)
        loadMoreFeed(true)
    }
    useEffect(() => {
        if (isLoggedIn) {
            reLoad()
            return
        }
        setProductData([])
        setNextURL(undefined)
        setIsListEnd(false)
        setIsInitialLoad(true)
        console.log('this')
    }, [isLoggedIn])

    useEffect(() => {
        const subscription = productLikeController.nextStream.subscribe(() => {
            reLoad()
        })
        return () => {
            subscription.unsubscribe();
        }
    }, [])


    const loadMoreFeed = async (reload = false) => {
        if (!reload && isListEnd) return
        const { data, totalCount, next } = await getUserFavoriteProducts(reload ? undefined : (nextURL ?? undefined));

        if (isNil(next)) {
            setNextURL(undefined)
            setIsListEnd(true)
        } else {
            setNextURL(next)

        }
        setProductData(productData.concat(data))
        setIsInitialLoad(false)
    }

    useEffect(() => {
        loadMoreFeed()
    }, [])


    const _renderFooter = () => {
        return <View style={{ height: 50 }} />
    }


    const _renderPlaceholder = () => {
        return <Placeholder Animation={Fade}>
            <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
                {range(3).map((_, index) => {
                    return (
                        <View style={{ marginBottom: 24 }} key={`${index}`}>
                            <ProductBoxPlaceholderRow />
                        </View>
                    );
                })}
            </View>
        </Placeholder>
    }
    const _renderProductEmpty = () => {
        return isInitialLoad ? <_renderPlaceholder /> : <EmptyView
            title={'Hãy thả tym'}
            titleStyle={{ marginTop: 4 }}
            description={'Bạn sẽ thấy những sản phẩm\nmà bạn đã thích'}
            descriptionStyle={{ marginTop: 4 }}
            file={require('_assets/images/empty/info_product.png')} />
    }

    const _renderItem = ({ item, index }) => {
        return <View key={`${item.pk}`} style={{
            flex: 1 / 2,
        }}>
            <View style={{
                paddingLeft: index % 2 != 0 ? 4 : 0,
                paddingRight: index % 2 != 0 ? 0 : 4
            }}>
                <ProductBox data={item} />
            </View>
        </View>
    }

    return productData.length == 0 ? <ScrollView
        contentContainerStyle={{ paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
    >{_renderProductEmpty()}</ScrollView> : <FlatList
        initialNumToRender={6}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ paddingHorizontal: 16, paddingTop: 12, }}
        data={productData}
        numColumns={2}
        ListEmptyComponent={_renderProductEmpty}
        ListFooterComponent={_renderFooter}
        renderItem={_renderItem}
        onEndReached={() => loadMoreFeed(false)}

    />
}


const FavoriteScreen = () => {
    const { params } = useRoute();
    const key = get(params, 'key', 0) as number;
    const [index, setIndex] = useState(key);
    const [routes] = useState<Route[]>([
        {
            key: 'feed',
            icon: 'list',
            title: 'Đã lưu',
        },
        {
            key: 'product',
            icon: 'cart',
            title: 'Sản Phẩm',
        },
    ]);

    const navigation = useNavigation();
    const { isLoggedIn } = useTypedSelector((state) => state.auth);

    const checkLogin = () => {
        if (!isLoggedIn) {
            renderLoginAlert(() => {
                navigation.goBack();
            });
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', checkLogin);
        return unsubscribe;
    }, [isLoggedIn]);

    useEffect(() => {
        checkLogin();
    }, [])

    const renderScene = ({
        route,
    }: SceneRendererProps & {
        route: Route;
    }) => {
        switch (route.key) {
            case 'feed':
                return <_UserFeedCollectionTab />;
            case 'product':
                return <_UserRelatedProductTab />;
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

            return (
                <TabBar
                    indicatorStyle={{ backgroundColor: Colors.black }}
                    style={{ backgroundColor: Colors.white, elevation: 0, shadowOpacity: 0, }}
                    labelStyle={{ color: Colors.black }}
                    renderLabel={({ route, focused }) => (
                        <DabiFont name={route.icon + (focused ? '_filled' : '_line')} />
                    )}
                    {...props}
                />
            );
        },
        [index],
    );

    return (
        <ConnectionDetection.View>
            <SafeAreaView >
                <View style={{ paddingLeft: 16, paddingVertical: 12, alignItems: 'flex-start' }}>
                    <View style={{ borderTopWidth: 4, paddingTop: 4, marginTop: 8 }}>
                        <Text style={Typography.h1}>Đã lưu</Text>
                    </View>
                </View>
            </SafeAreaView>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Spacing.screen.width }}
                renderTabBar={renderTabBar}
                timingConfig={{
                    duration: 200,
                }}
                lazy
            />
        </ConnectionDetection.View >

    );
};

export default ConnectionDetection.HOC(FavoriteScreen);
