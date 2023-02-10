import { Header } from "components/header/Header";
import { ListController } from "components/list/ListController";
import { FeedbackList } from "components/list/post/FeedbackList.v2";
import { FeedbackInfo } from "model";
import React, { useEffect, useRef } from 'react';
import { getFollowingFeeds } from 'services/api/user/user.favorite.api';
import { SafeAreaView, View } from 'react-native';
import { EmptyView } from "components/empty/EmptyView";


export const FeedCollectionTab = () => {
    const controller = useRef(new ListController<FeedbackInfo>()).current;

    return <View style={{ flex: 1, paddingTop: 8 }}>

        <FeedbackList controller={controller}
            fetch={getFollowingFeeds}
            renderEmpty={() => {
                return <EmptyView
                    title={'Chưa có bài viết nào được lưu'}
                    description={'Bạn hãy xem bài viết ở Trang chủ và lưu lại nhé!'}
                    file={require('assets/images/empty/info_post.png')}

                />
            }} /></View>
};