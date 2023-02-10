import { useNavigation } from '@react-navigation/native';
import Button, { ButtonType, LayoutConstraint } from 'components/button/Button';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { UserBox } from 'components/list/user/UserBox';
import { isEmpty, range } from 'lodash';
import { Influencer } from 'model/influencer/influencer';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageRequireSource, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Carousel from 'react-native-snap-carousel';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import { RoutePath } from 'routes';
import { followInfluencer, getFollowingList, getInfluencerFollowingList } from 'services/api/influencer/influencer.api';
import { PaginationResponse } from 'services/http/type';
import { Colors, Spacing, Typography } from 'styles';
import { unAwaited } from 'utils/helper/function.helper';
import { useActions } from "utils/hooks/useActions";
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { FollowButton } from './FollowButton';




export const FollowingListTab = ({ pk, is_me }) => {
    const { state: _state, excecute, data, refresh } = useAsync(() => getInfluencerFollowingList(undefined, pk), {
        emptyDataLogical: (data) => isEmpty(data.results),
    });

    const [state, setState] = useState(_state);

    // have to use useRef because cannot get
    // update state in navigation.addListener.focus
    const stateRef = useRef(state);
    const shouldRefresh = useRef(false);

    useEffect(() => {
        setState(_state);
    }, [_state]);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const navigation = useNavigation();

    const onRefocus = () => {
        if (stateRef.current === ConnectionState.hasEmptyData && shouldRefresh.current) {
            excecute();
        }
        shouldRefresh.current = false;
    };

    useEffect(() => {
        excecute();
        const subscription = navigation.addListener('focus', onRefocus);

        return () => {
            subscription();
        };
    }, []);

    const onSearchingKol = () => {
        shouldRefresh.current = true;
        navigation.navigate(RoutePath.feedbacks);
    };

    switch (state) {
        case ConnectionState.waiting:
            return (
                <View testID={'waiting-view'}>
                    <_ListPlaceholder showHeader={true} />
                </View>
            );
        case ConnectionState.hasEmptyData:
            return <_Empty onSearchingKol={onSearchingKol} is_me={is_me} />;
        case ConnectionState.hasData:
            return (
                <View testID={'has-data-view'} style={{ flex: 1 }}>
                    <_List
                        onEmptyData={() => setState(ConnectionState.hasEmptyData)}
                        initialResponse={data!}
                        is_me={is_me}
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
    onEmptyData,
    is_me = false
}: {
    initialResponse: PaginationResponse<Influencer>;
    onEmptyData: () => void;
    is_me: boolean
}) => {
    const { results, next, count = 0 } = initialResponse;
    console.log(next)
    const { onScroll, data: _data, state, endReached } = usePagingFetch({
        initialData: results,
        next: next ?? undefined,
        fetch: getFollowingList,
    });

    const { showDialog } = useActions()

    const [data, setData] = useState<Influencer[]>(_data);
    const following_count = useTypedSelector((state) => state.user.userInfo.following);

    useEffect(() => {
        setData(_data);
    }, [_data]);

    useEffect(() => {
        if (isEmpty(data)) onEmptyData();
    }, [data]);


    const onUnfollow = (id?: number, shoulCallApi?: boolean) => {
        if (!data || !id) return;
        const item = data.find((value) => value.pk === id);
        if (shoulCallApi) {
            showDialog({
                title: `Bạn chắc chắn muốn Bỏ theo dõi ${item?.name ?? ''}?`,
                actions: [{
                    text: 'BỎ THEO DÕI',
                    onPress: () => {
                        onRemove(id);
                        unAwaited(followInfluencer(id, false));
                    },
                }, {
                    text: 'Hủy',
                    type: ButtonType.flat,
                    onPress: () => {/***/ },
                    textStyle: { color: Colors.primary },
                }
                ]
            })
        } else {
            onRemove(id);
        }
    };

    const onRemove = (id: number) => {
        const newData = data.filter((value) => value.pk !== id);
        // const item = data.find((value) => value.pk === id);
        // toast(`Đã bỏ theo dõi ${item?.insta_id}`);
        setData(newData);
    };

    const itemBuilder = ({ item }: { item: Influencer }) => {
        return <UserBox data={item!} />;
    };

    const keyExtractor = (item: Influencer, index: number) => `${index}`;

    return (
        <FlatList
            testID="list-data"
            onScroll={onScroll}
            data={data}
            renderItem={itemBuilder}
            keyExtractor={keyExtractor}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text style={Typography.description}>{`Đang theo dõi ${is_me ? following_count : count} người`}</Text>
                </View>
            }
            ListFooterComponent={
                !endReached ? <View style={{ paddingVertical: 16 }}><ActivityIndicator color={Colors.surface.midGray} /></View> : null
            }
        />
    );
};

const _Empty = ({ onSearchingKol, is_me = false }: { onSearchingKol: () => void, is_me: boolean }) => {
    return (
        <View testID={'empty-view'} style={{ justifyContent: 'center', flex: 1, paddingHorizontal: 24 }}>
            <EmptyView
                style={{ transform: [{ translateY: -48 /** header */ }] }}
                title={is_me ? 'Bạn chưa theo dõi ai' : 'Chưa theo dõi ai'}
                description={is_me ? 'Hãy bấm “Theo dõi” để không bỏ lỡ\ntin tức mà bạn yêu thích' : 'Hãy kết bạn và cùng nhau theo dõi người chung sở thích nhé!'}
                file={require('assets/images/empty/info_follow.png') as ImageRequireSource}
            />
        </View>
    );
};

const InfluencerItem = ({
    data,
    onUnfollow,
}: {
    data: Influencer;
    onUnfollow: (id?: number, shouldCallApi?: boolean) => void;
}) => {
    const { pk, profile_image, name } = data;
    const testID = `item-${pk}`;

    const unfollow = () => onUnfollow(pk, true);

    const navigation = useNavigation();

    const navigate = () => {
        navigation.navigate(RoutePath.UserProfile, {
            pk: data.pk,
            onUnfollow: () => onUnfollow(pk, false),
        });
    };

    return (
        <View>
            <Ripple onPress={navigate} style={styles.itemContainer} testID={testID}>
                <Image style={styles.itemImage} source={{ uri: profile_image }} />
                <View style={{ width: 12 }} />
                <Text numberOfLines={1} style={[Typography.name_button, { width: '56%' }]}>
                    {data!.name}
                </Text>
                <View style={{ flex: 1 }} />
            </Ripple>
            <View
                style={{ position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' }}>
                <FollowButton
                    pk={pk}
                    name={name} />
            </View>
        </View>
    );
};

const _ListPlaceholder = ({ count = 16, showHeader }: { count?: number; showHeader: boolean }) => {
    return (
        <Placeholder Animation={Fade}>
            {showHeader && (
                <View style={styles.headerContainer}>
                    <PlaceholderLine
                        noMargin
                        height={17}
                        style={{
                            width: 80,
                            backgroundColor: Colors.white,
                        }}
                    />
                </View>
            )}
            {range(count).map((_, index) => (
                <InfluencerItemPlaceholder key={`${index}`} />
            ))}
        </Placeholder>
    );
};

const InfluencerItemPlaceholder = (props: { key: string }) => {
    return (
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
