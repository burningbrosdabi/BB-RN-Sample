import { useNavigation } from '@react-navigation/native';
import ProfileImage from 'components/images/ProfileImage';
import { ProductFilter } from 'components/list/product/filter';
import { List } from 'components/list/product/ProductList.v2';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StoreUpdateRouteSetting } from 'routes';
import { NavigationService } from 'services/navigation';
import { useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { getFollowingStoreUpdate, getProductList } from '_api';
import { Colors, Outlines, Spacing, Typography } from '_styles';
import { CollectionsRef } from './collection/Collections';
import { HorizontalCategoryList, HorizontalCategoryListRef } from './HorizontalCategoryList';
import { storeLikeController } from 'services/user';
import { StoreInfo } from 'model';
import Ripple from 'react-native-material-ripple';
import { PickIn6ExplanationRouteSetting } from 'routes/pick/pick.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { BannerHeader } from 'scenes/home/promotion/PromotionBanner';

const HomeTab = () => {
    // const listType = useMemo(() => {
    //     return remoteConfigService().getHomeLayout()
    // }, []);

    const { controller, fetch: fetchProduct } = List.useHandler(undefined, ({ offset }) =>
        getProductList({ personalization: true, offset }),
    );
    const storeUpdateRef = useRef(null);
    const bannerRef = useRef(null);
    const catgListRef = useRef<HorizontalCategoryListRef>();
    const collectionRef = useRef<CollectionsRef>();

    const onRefresh = () => {
        bannerRef?.current?.refresh();
        storeUpdateRef?.current?.refresh();
        catgListRef?.current?.refresh();
        collectionRef.current?.refresh();
    };

    // const fetchFeed = (next?: string) => {
    //     return getFeedbackListV2(next, {
    //         ordering: FeedbackOrdering.recent
    //     });
    // };

    // const fetch = useMemo(() => {
    //     if (listType === HomeList.feed) {
    //         return fetchFeed;
    //     }
    //     return fetchProduct;
    // }, []);

    // if (listType === HomeList.feed) {
    //     return (
    //         <FeedbackList
    //             Header={
    //                 <View>
    //                     <BannerHeader ref={bannerRef} />
    //                     <View style={{ height: 12 }} />
    //                     <HorizontalCategoryList ref={catgListRef} />
    //                     <PickBanner />
    //                     {/* <Collections ref={collectionRef}/> */}
    //                     <_StoreUpdate ref={storeUpdateRef} />
    //                     <Text style={{ marginLeft: 16, ...Typography.title }}>Gợi ý dành cho bạn</Text>
    //                 </View>
    //             }
    //             fetch={fetch} />
    //     );
    // }

    return (
        <List.Product
            showScrollToTopBtn={false}
            controller={controller}
            fetch={fetchProduct}
            refresh={onRefresh}
            renderAheadMultiply={3}
            HeaderComponent={
                <View>
                    <BannerHeader ref={bannerRef} />
                    <View style={{ height: 12 }} />
                    <HorizontalCategoryList ref={catgListRef} />
                    <PickBanner />
                    {/* <Collections ref={collectionRef}/> */}
                    <_StoreUpdate ref={storeUpdateRef} />
                    <Text style={{ marginLeft: 16, ...Typography.title }}>Gợi ý dành cho bạn</Text>
                </View>
            }
        />
    );
};

const PickBanner = () => {
    const navigator = useNavigator();
    const user_type = useTypedSelector(state => state.user?.userInfo?.user_type)

    const navigatePick = () => {
        navigator.navigate(new PickIn6ExplanationRouteSetting());
    }

    // if (user_type !== UserType.SUPPORTER) return <></>
    return <View style={{ paddingBottom: 24, paddingHorizontal: 16 }}>
        <Ripple onPress={navigatePick} rippleContainerBorderRadius={8}>
            <ImageBackground source={require('assets/images/banner/pick_banner.png')}
                style={{
                    paddingHorizontal: 12,
                    height: 82,
                    backgroundColor: Colors.background,
                    justifyContent: 'center', borderRadius: 8, overflow: 'hidden'
                }}>
                <Text
                    style={[Typography.title, { color: 'white' }]}>{'Cùng tìm hiểu phong cách\ncủa bạn là gì nhé'}</Text>
            </ImageBackground>
        </Ripple>
    </View>
}


const _StoreUpdate = forwardRef((props, ref) => {
    const navigation = useNavigation();
    const { isLoggedIn } = useTypedSelector((state) => state.auth);

    useImperativeHandle(ref, () => ({
        refresh() {
            if (isLoggedIn) {
                getStoreUpdate();
            }
        },
    }));

    const { excecute: getStoreUpdate, data: _data, refresh } = useAsync(getFollowingStoreUpdate);
    const [data, setData] = useState<StoreInfo[]>([]);

    useEffect(() => {
        setData(_data?.data ?? [])
    }, [_data])

    const _onPressStoreUpdate = () => {
        NavigationService.instance.navigate(
            new StoreUpdateRouteSetting(),
        );
    };

    useEffect(() => {
        if (isLoggedIn) {
            getStoreUpdate();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const subscription = storeLikeController.nextStream.subscribe((value) => {
            refresh();
        })

        return () => {
            subscription.unsubscribe();
        }
    }, [data])

    const _renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    navigation.navigate('StoreDetail', { pk: item.pk, ordering: 'new_product' });
                }}>
                <ProfileImage style={{ borderWidth: 0 }} source={item.profile_image} border />
                <View style={{ height: 4 }} />
                <Text numberOfLines={1} style={[Typography.description, { color: Colors.text }]}>
                    {item.insta_id}
                </Text>
            </TouchableOpacity>
        );
    };

    const keyExtractor = (item: { pk: number }) => `${item.pk}`;

    if (data.length <= 0 || !isLoggedIn) return null;
    return (
        <View style={styles.storeUpdate}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                }}>
                <Text numberOfLines={1} style={{ ...Typography.title, width: '75%' }}>
                    Hôm nay có gì mới?
                </Text>
                <Text
                    onPress={_onPressStoreUpdate}
                    style={Typography.description}>
                    Xem tất cả
                </Text>
            </View>
            <View style={{ height: 12 }} />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({ item, index }) => _renderItem({ item, index })}
                keyExtractor={keyExtractor}
                style={styles.list}

            />
        </View>
    );
});

export default ProductFilter.HOC(React.memo(HomeTab));

const styles = StyleSheet.create({
    storeUpdate: {
        paddingBottom: 36,
        width: Spacing.screen.width,
    },
    list: {
        paddingHorizontal: 10
    },
    itemContainer: {
        width: 68,
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginRight: 8,

    },
    itemImage: {
        resizeMode: 'contain',
        borderRadius: 20,
        borderWidth: Outlines.borderWidth.base,
        borderColor: Colors.surface.lightGray,
    },
});
