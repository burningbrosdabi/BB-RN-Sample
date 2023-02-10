import { useNavigation } from '@react-navigation/native';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { UserBox } from 'components/list/user/UserBox';
import { isEmpty, range } from 'lodash';
import { Influencer } from 'model/influencer/influencer';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ImageRequireSource, StyleSheet, Text, View } from 'react-native';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import { RoutePath } from 'routes';
import { getFollowerList, getInfluencerFollowerList } from 'services/api/influencer/influencer.api';
import { PaginationResponse } from 'services/http/type';
import { Colors, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

export const FollowerListTab = ({ pk, is_me }: { pk: number, is_me: boolean }) => {
    const { state: _state, excecute, data, refresh } = useAsync(() => getInfluencerFollowerList(undefined, pk), {
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
            return <_Empty onSearchingKol={onSearchingKol} is_me={is_me}
            />;
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

    const { onScroll, data: _data, state, endReached } = usePagingFetch({
        initialData: results,
        next: next ?? undefined,
        fetch: getFollowerList,
    });

    const [data, setData] = useState<Influencer[]>(_data);

    const follower_count = useTypedSelector((state) => state.user.userInfo.follower);

    useEffect(() => {
        setData(_data);
    }, [_data]);

    useEffect(() => {
        if (isEmpty(data)) onEmptyData();
    }, [data]);

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
                    <Text style={Typography.description}>{`${is_me ? follower_count : count} người theo dõi`}</Text>
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
                title={is_me ? 'Chưa có ai theo dõi bạn hết' : 'Chưa có ai theo dõi bạn ấy'}
                description={is_me ? 'Nếu muốn quen thêm bạn mới, hãy bình luận và thả tim tại các bài đăng của họ' : 'Hãy kết bạn và theo dõi để nhận thông báo mới nhất nhé!'}
                file={require('assets/images/empty/info_follow.png') as ImageRequireSource}
            />
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
