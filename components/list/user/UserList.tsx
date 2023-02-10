import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { UserBox } from 'components/list/user/UserBox';
import { FeatureMeasurement } from 'components/tutorial';
import { isEmpty, isNil, range } from 'lodash';
import { UserInfoImpl } from 'model/user/user';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageRequireSource, StyleSheet, View, Text, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import { getFollowRecommendationList, getUserList } from 'services/api';
import { PaginationResponse } from 'services/http/type';
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';


export const RecommendUserList = () => {
    const { state, excecute, data, refresh } = useAsync(() => getFollowRecommendationList(undefined, {}), {
        emptyDataLogical: (data) => isEmpty(data.results),
    });

    useEffect(() => {
        excecute();
    }, []);

    const itemBuilder = ({ item, index }: { item: UserInfoImpl, index: number }) => {
        if (isNil(item)) return
        const { recent_posts } = item
        return (<View>
            {/* <View style={{ position: 'absolute', right: 62, top: 32 }}>
                {index == 0 && <FeatureMeasurement
                    id={'user-follow'}
                    title={'Follow KOLs with your style 😎'}
                    description={
                        'Lets follow some KOLs of your style, DABI will keep update you when they have new posts!!'
                    }

                    overlay={
                        <View style={{
                            paddingVertical: 3, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.black,
                            backgroundColor: applyOpacity(Colors.black, 1),
                            borderRadius: 14,
                        }}>
                            <Text style={{ ...Typography.body, color: Colors.white }}>Theo dõi +</Text>
                        </View>}><></></FeatureMeasurement>}
            </View> */}
            <UserBox data={item} />
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12 }}>
                <Image style={{ flex: 1, aspectRatio: 4 / 5, backgroundColor: Colors.background }} source={{ uri: !isNil(recent_posts[0]) ? recent_posts[0].thumbnail_image : undefined }}></Image>
                <View style={{ width: 8 }} />
                <Image style={{ flex: 1, aspectRatio: 4 / 5, backgroundColor: Colors.background }} source={{ uri: !isNil(recent_posts[1]) ? recent_posts[1].thumbnail_image : undefined }}></Image>
                <View style={{ width: 8 }} />
                <Image style={{ flex: 1, aspectRatio: 4 / 5, backgroundColor: Colors.background }} source={{ uri: !isNil(recent_posts[2]) ? recent_posts[2].thumbnail_image : undefined }}></Image>
            </View>
        </View >)
    };
    const keyExtractor = (item: UserInfoImpl, index: number) => `${index}`;

    switch (state) {
        case ConnectionState.waiting:
            return (
                <View testID={'waiting-view'}>
                    <_ListPlaceholder showPreview={true} />
                </View>
            );
        case ConnectionState.hasEmptyData:
            return <_Empty />;
        case ConnectionState.hasData:
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data?.results}
                        renderItem={itemBuilder}
                        maxToRenderPerBatch={5}
                        onEndReachedThreshold={1}
                        initialNumToRender={10}
                        updateCellsBatchingPeriod={100}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews
                        keyExtractor={keyExtractor}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    // ListFooterComponent={
                    //     state === ConnectionState.waiting ? <_ListPlaceholder count={3} showPreview={showPreview} /> : null
                    // }
                    />
                </View>
            );
        case ConnectionState.hasError:
            return (
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                    testID={'error-view'}>
                    <GenericErrorView />
                </View>
            );
        default:
            return <></>;
    }
};


export const UserList = ({ query, fetch }: { query: string; fetch?: () => Promise<PaginationResponse<UserInfoImpl>> }) => {
    const fetchUser = fetch ?? getUserList
    const { state, excecute, data, refresh } = useAsync(() => fetchUser(undefined, {
        query: query
    }), {
        emptyDataLogical: (data) => isEmpty(data.results),
    });

    useEffect(() => {
        excecute();
    }, []);

    switch (state) {
        case ConnectionState.waiting:
            return (
                <View testID={'waiting-view'}>
                    <_ListPlaceholder showHeader={true} />
                </View>
            );
        case ConnectionState.hasEmptyData:
            return <_Empty />;
        case ConnectionState.hasData:
            return (
                <View testID={'has-data-view'} style={{ flex: 1 }}>
                    <_List
                        initialResponse={data!}
                        fetch={(next) => fetchUser(next, {
                            query: query
                        })}
                    />
                </View>
            );
        case ConnectionState.hasError:
            return (
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                    testID={'error-view'}>
                    <GenericErrorView />
                </View>
            );
        default:
            return <></>;
    }
};

const _List = ({
    initialResponse,
    showPreview = false,
    fetch,
}: {
    initialResponse: PaginationResponse<UserInfoImpl>;
    showPreview?: boolean,
    fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
}) => {
    const { results, next, count = 0 } = initialResponse;
    console.log(next)
    const { onScroll, data: _data, state } = usePagingFetch({
        initialData: results,
        next: next ?? undefined,
        fetch: fetch,
    });

    const [data, setData] = useState<UserInfoImpl[]>(_data);

    useEffect(() => {
        setData(_data);
    }, [_data]);

    useEffect(() => {
    }, [data]);


    const itemBuilder = ({ item }: { item: UserInfoImpl }) => {
        if (isNil(item)) return
        return <UserBox data={item} />
    };

    const keyExtractor = (item: UserInfoImpl, index: number) => `${index}`;

    return (
        <FlatList
            testID="list-data"
            onScroll={onScroll}
            data={data}
            renderItem={itemBuilder}
            maxToRenderPerBatch={5}
            onEndReachedThreshold={1}
            initialNumToRender={10}
            updateCellsBatchingPeriod={100}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingBottom: 50 }}
            ListFooterComponent={
                state === ConnectionState.waiting ? <_ListPlaceholder count={3} showPreview={showPreview} /> : null
            }
        />
    );
};

const _Empty = () => {
    return (
        <View testID={'empty-view'}>
            <EmptyView
                title={'Không có kết quả bạn cần tìm'}
                description={'Vui lòng kiểm tra lại từ khóa của bạn'}
                file={require('assets/images/empty/info_follow.png') as ImageRequireSource}
            />
        </View>
    );
};



const _ListPlaceholder = ({ count = 16, showPreview = false }: { count?: number; showPreview: boolean }) => {
    return (
        <Placeholder Animation={Fade}>
            {range(count).map((_, index) => (
                <InfluencerItemPlaceholder key={`${index}`} showPreview={showPreview} />
            ))}
        </Placeholder>
    );
};

const InfluencerItemPlaceholder = ({ showPreview }: { showPreview?: boolean }) => {
    return (
        <View>
            <View style={styles.itemContainer}>
                <PlaceholderMedia style={[styles.itemImage, { backgroundColor: Colors.white }]} />

                <View style={{ width: 12 }} />
                <PlaceholderLine
                    noMargin
                    height={17}
                    style={{
                        width: 140,
                        backgroundColor: Colors.white,
                    }}
                />
                <View style={{ flex: 1 }} />
                <PlaceholderMedia style={{ height: 28, width: 90, backgroundColor: Colors.white }} />
            </View>
            {showPreview &&
                <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12 }}>
                    <PlaceholderMedia style={{ width: (Spacing.screen.width - 16 * 3) / 3, aspectRatio: 4 / 5, borderRadius: 0 }} />
                    <View style={{ width: 8 }} />
                    <PlaceholderMedia style={{ width: (Spacing.screen.width - 16 * 3) / 3, aspectRatio: 4 / 5, borderRadius: 0 }} />
                    <View style={{ width: 8 }} />
                    <PlaceholderMedia style={{ width: (Spacing.screen.width - 16 * 3) / 3, aspectRatio: 4 / 5, borderRadius: 0 }} />
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        height: 64,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    headerContainer: { height: 40, paddingHorizontal: 16, justifyContent: 'center' },
    itemImage: { height: 40, width: 40, borderRadius: 20, backgroundColor: Colors.background },
});
