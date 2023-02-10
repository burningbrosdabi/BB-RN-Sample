import { useIsFocused, useNavigation } from '@react-navigation/native';
import { UpIcon } from 'assets/icons';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import ProfileImage from 'components/images/ProfileImage';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { isEmpty, isNil, range } from 'lodash';
import { StoreInfo } from 'model';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Fade, Placeholder } from 'rn-placeholder';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { getFollowingStoreUpdate } from '_api';
import { HEADER_HEIGHT } from "_helper";
import { StoreListBoxPlaceholder } from './StoreListBoxPlaceholder';
import StoreUpdateProductList from './StoreUpdateProductList';
import { ConnectionState, useAsync } from "utils/hooks/useAsync";


const INITIAL_OFFSET = 15;

const StoreUpdateScreen = () => {
    const { state, data, excecute } = useAsync(getFollowingStoreUpdate, {
        emptyDataLogical: (value) => isEmpty(value.data)
    });

    useEffect(() => {
        excecute();
    }, [])


    return <SafeAreaWithHeader
        title={"Cập nhật cửa hàng"}>
        <View style={{ height: HEADER_HEIGHT }} />
        {
            state === ConnectionState.waiting && <_Placeholder />
        }
        {
            state === ConnectionState.hasData && <_StoreUpdateScreen data={data!.data} />
        }
        {
            state === ConnectionState.hasError && <GenericErrorView />
        }
        {
            state === ConnectionState.hasEmptyData && <Empty />
        }
    </SafeAreaWithHeader>
}

const _StoreUpdateScreen = ({ count = 15, data: routeData }: { data: any[], count?: number }) => {
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const [data, setData] = useState(routeData);
    const [isDataEnd, setIsDataEnd] = useState((data?.length ?? 0) < INITIAL_OFFSET);
    const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        setIsFirstLoad(false);
    }, []);

    const fetchData = async (props: any) => {
        const results = await getFollowingStoreUpdate({ ...props });

        return results;
    };

    const _fetchMoreData = async (recreate = false) => {
        if (!inProgressNetworkReq) {
            setInProgressNetworkReq(true)
            const { data: newData, totalCount } = await fetchData({
                offset: recreate ? 0 : offset
            });
            setInProgressNetworkReq(false)
            if ((totalCount <= count || offset >= totalCount) && !recreate) {
                setIsDataEnd(true)
            }
            if (recreate) {
                setData(newData)
                setOffset(count)
            } else {
                const newList = getUniqueListBy(data.concat(newData), 'pk')
                setData(newList)
                setOffset(offset + count)
            }
        }
    };

    const handleListEnd = async () => {
        if (!isDataEnd) {
            await _fetchMoreData();
        }
    };

    const onPressFollow = async (isAdded: boolean, store: StoreInfo) => {
        if (isAdded) {
            const newData = data.filter(
                (item) => item.pk !== store.pk,
            )
            setData(newData)
        }
    };

    const _rowRenderer = (type: any, data: any, index: number) => {
        const time = (data?.latest_product_timestamp && moment(data?.latest_product_timestamp).isValid()) ? moment(data?.latest_product_timestamp).fromNow() : ""
        let products = data.new_products || []
        if (products?.length > 4) {
            products = products.slice(0, 4)
        }
        const handleSeeMore = () => {
            navigation.navigate('StoreDetail', { store: data, ordering: 'new_product' })
        };
        return (
            <View style={{}}>
                <View style={styles.sectionHeaderContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('StoreDetail', { store: data })}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <ProfileImage size={40} source={data?.profile_image} border />
                            <View style={{ width: Spacing.screen.width - 16 * 2 - 40 - 12 * 2 - 70 }}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.instaText, {
                                        backgroundColor: data?.insta_id ? 'transparent' : Colors.surface.lightGray,
                                    }]}>
                                    {data?.insta_id}{''}
                                </Text>
                                {time ? <Text
                                    style={styles.timeText}>
                                    {time}
                                </Text> : undefined}
                            </View>
                        </View>
                    </TouchableOpacity>
                    <StoreFavoriteTextButton onPressFollow={onPressFollow} style={{ alignSelf: 'center' }} data={data} />
                </View>
                <StoreUpdateProductList data={products} />
                {(data.new_products?.length > 4) ? <View style={styles.endView}>
                    <Button
                        constraint={LayoutConstraint.matchParent}
                        text={'Xem tất cả'}
                        type={ButtonType.outlined}
                        onPress={handleSeeMore}
                    />
                </View> :
                    <View style={[styles.endView, { paddingBottom: 0 }]} />
                }
            </View>
        );
    };

    const _renderFooter = () => {
        return isDataEnd ? (
            <View style={{ height: 24 }}></View>
        ) : (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 40,
                }}>
                <ActivityIndicator color={Colors.surface.midGray} />
            </View>
        );
    };

    const onRefresh = async () => {
        setIsDataEnd(false)
        await _fetchMoreData(true)
    }

    const onGotoTop = () => {
        flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
    }

    return (
        <View style={{ flex: 1 }}>
            {isFirstLoad ? (
                <_Placeholder />
            ) : (
                <ConnectionDetection.View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            initialNumToRender={15}
                            maxToRenderPerBatch={15}
                            windowSize={30}
                            ref={flatListRef}
                            showsVerticalScrollIndicator={false}
                            data={data}
                            renderItem={({ item, index }) => _rowRenderer(null, item, index)}
                            keyExtractor={(item: any, index) => `${item.name}${index}`}
                            onEndReached={handleListEnd}
                            onEndReachedThreshold={0.05}
                            ListEmptyComponent={() => <Empty />}
                            ListFooterComponent={_renderFooter}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={onRefresh}
                                />
                            }
                        />
                        {data.length > 0 ?
                            <View style={styles.upIconContainer}>
                                <TouchableOpacity
                                    onPress={onGotoTop}
                                    style={{ alignItems: 'center' }}>
                                    <View style={[styles.buttonContainer]}>
                                        <UpIcon />
                                    </View>
                                </TouchableOpacity>
                            </View> : undefined}
                    </View>
                </ConnectionDetection.View>
            )}
        </View>
    );
}

const Empty = () => {
    return <View style={styles.emptyContainer}>
        <EmptyView
            title={'Theo dõi một cửa hàng'}
            titleStyle={{ marginTop: 24 }}
            description={'Không có cửa hàng nào\n bạn đang theo dõi'}
            descriptionStyle={{ marginTop: 6 }}
            file={require('_assets/images/icon/info_not_following.png')}
        />
    </View>
}

export default React.memo(StoreUpdateScreen);

const _Placeholder = () => {
    return (
        <View>
            <Placeholder Animation={Fade}>
                <View style={{ paddingHorizontal: 16 }}>
                    {range(3).map((_, index) => {
                        return <StoreListBoxPlaceholder key={index} />;
                    })}
                </View>
            </Placeholder>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionList: {
        flex: 1,
    },
    itemContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        width: '100%',
        justifyContent: 'space-between',
    },
    sectionHeaderContainer: {
        paddingHorizontal: 16,
        backgroundColor: Colors.white,
        flexDirection: "row",
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 12,
        alignItems: 'center',
    },
    timeText: {
        ...Typography.description,
        marginHorizontal: 12,
        color: Colors.surface.darkGray,
    },
    instaText: {
        ...Typography.name_button,
        marginHorizontal: 12,
    },
    emptyContainer: {
        height: Spacing.screen.height - getStatusBarHeight() - 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endView: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        borderBottomWidth: Outlines.borderWidth.base,
        borderColor: Colors.background,
    },
    buttonContainer: {
        padding: 8,
        zIndex: 500,
        backgroundColor: theme.WHITE,
        borderWidth: Outlines.borderWidth.base,
        borderColor: theme.LIGHT_GRAY,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderRadius: 50,
    },
    upIconContainer: {
        zIndex: 1000,
        position: 'absolute',
        bottom: theme.MARGIN_20,
        right: theme.MARGIN_20,
        alignItems: 'center',
    },

});
