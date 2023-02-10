import { useNavigation } from '@react-navigation/native';
import { ImageElementNative } from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import { ProductFilter } from 'components/list/product/filter';
import { List } from 'components/list/product/ProductList.v2';
import { StoreInfo } from "model";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ripple from "react-native-material-ripple";
import { StoreUpdateRouteSetting } from 'routes';
import { PickIn6ExplanationRouteSetting } from "routes/pick/pick.route";
import { PromotionRouteSetting } from 'routes/promotion/promotion.route';
import { NavigationService } from 'services/navigation';
import { useNavigator } from "services/navigation/navigation.service";
import { storeLikeController } from "services/user";
import { useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { getDiscountBanner, getFollowingStoreUpdate, getProductList } from '_api';
import { Colors, Outlines, Spacing, Typography } from '_styles';
import { CollectionsRef } from './collection/Collections';
import { HorizontalCategoryList, HorizontalCategoryListRef } from './HorizontalCategoryList';

const KoreaTab = () => {
    const { controller, fetch } = List.useHandler(undefined,
        () => getProductList({ personalization: true }),
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

    return (
        <List.Product
            controller={controller}
            fetch={fetch}
            refresh={onRefresh}
            renderAheadMultiply={3}
            HeaderComponent={
                <View>
                    {/* 인기 상품들의 배너입니다. Or 공동구매 기능입니다. */}
                    <BannerHeader ref={bannerRef} />
                    {/* <Collections ref={collectionRef}/> */}
                    <Text style={{ marginLeft: 16, ...Typography.title }}>Gợi ý dành cho bạn</Text>
                </View>
            }
        />
    );
};


const BannerHeader = forwardRef((props, ref) => {
    // Change this into other banner
    const { excecute, data } = useAsync(getDiscountBanner);

    useEffect(() => {
        excecute()
    }, [])

    useImperativeHandle(ref, () => ({
        refresh() {
            excecute();
        },
    }));

    const _onPress = () => {
        NavigationService.instance.navigate(new PromotionRouteSetting());
    };

    return (
        <View style={{ justifyContent: 'space-between', paddingBottom: 12, }}>
            <TouchableOpacity onPress={_onPress} style={{ height: Spacing.screen.width / 16 * 9 }}>
                <ImageElementNative image={data?.list_thumb_picture}
                />
            </TouchableOpacity>
        </View>
    );
});

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
                    navigation.navigate('StoreDetail', { store: item, ordering: 'new_product' });
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
                refreshing={false}
                onRefresh={refresh}
            />
        </View>
    );
});

export default ProductFilter.HOC(React.memo(KoreaTab));

const styles = StyleSheet.create({
    storeUpdate: {
        paddingHorizontal: 16,
        paddingBottom: 36,
        width: Spacing.screen.width,
    },
    list: {},
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
