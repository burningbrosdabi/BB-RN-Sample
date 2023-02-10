import { useRoute } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { toast } from 'components/alert/toast';
import Button from 'components/button/Button';
import { GenericErrorView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import { FeedbackList, FeedbackListRef, Layout } from 'components/list/post/FeedbackList.v2';
import { FeedFilter } from 'components/list/post/filter';
import { get, isEmpty, isNil } from 'lodash';
import { LocationType } from 'model';
import React, { useEffect, useRef } from 'react';
import { Image, Linking, SafeAreaView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Typography, Colors } from 'styles';
import { useAsync } from 'utils/hooks/useAsync';
import { feedStream, getFeedbackListV2, getFeedDetail } from '_api';

export const PlaceDetailScreen = () => {

    const { params } = useRoute();
    const location = get(params, 'location');
    if (isNil(location)) return <GenericErrorView />;

    const listRef = useRef<FeedbackListRef>();

    useEffect(() => {
        const subscription = feedStream.subscribe(_ => {
            listRef?.current?.refresh();
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);


    const feedFetchByLocation = (next?: string) => {
        return getFeedbackListV2(next, {
            location_id: location.pk
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <ConnectionDetection.View>
                <SafeAreaView><Header /></SafeAreaView>
                <FeedbackList
                    Header={<_Header data={location} />}
                    showScrollToTopBtn={true}
                    floatingButtonBottomMargin={24}
                    layout={Layout.grid}
                    renderAheadMultiply={1}
                    ref={listRef}
                    fetch={feedFetchByLocation}
                />
            </ConnectionDetection.View>
        </View>
    );
};

const _Header = ({ data }: { data: LocationType }) => {

    const { name, additional_address, ward, google_map_url, opening_hour, preview_image, business_category } = data

    const onPressMap = () => {
        if (isEmpty(google_map_url)) return
        Linking.openURL(google_map_url)
    }
    return (
        <View style={{ width: '100%' }}>
            {!isEmpty(preview_image) &&
                <FastImage source={{ uri: preview_image }} style={{ width: '100%', aspectRatio: 16 / 9, marginVertical: 12 }} resizeMode={'cover'} />}
            <View style={{ paddingHorizontal: 16 }}>

                <Text style={Typography.title}>{name}</Text>
                {!isEmpty(business_category) && <Text style={Typography.body}>{business_category?.display_name}</Text>}
                <View style={{ height: 12 }} />
                {
                    !isEmpty(ward) &&
                    <Text style={Typography.description}>{additional_address}, {ward}</Text>
                }
                <View style={{ height: 24 }} />
                {
                    !isEmpty(opening_hour) &&
                    <Text style={Typography.description}><Text style={Typography.mark}>Giờ mở cửa</Text> : {opening_hour}</Text>
                }
                <View style={{ height: 24 }} />
                <Button prefixIcon={<DabiFont name='place' color={Colors.white} paddingRight={12} />} text={'Xem bản đồ'} onPress={onPressMap} />
                <View style={{ height: 36 }} /><Text style={Typography.subtitle}>Bài viết tại đây</Text>
                <View style={{ height: 12 }} />
                {/* <_followingSection /> */}
            </View>
        </View >
    );
}