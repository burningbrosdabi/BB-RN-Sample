import { FeedbackList, FeedbackListRef, Layout } from "components/list/post/FeedbackList.v2";
import { FeedbackOrderingModalRef } from "components/list/post/FeedbackOrdering";
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Colors } from "styles";
import { feedbackOrderingList } from "utils/data";
import { FeedbackOrdering, getFeedbackListV2 } from '_api';
import { Header } from "components/header/Header";
import { useRoute } from "@react-navigation/core";
import { get, isNil } from "lodash";
import { ConnectionDetection } from "components/empty/OfflineView";
import { SwitchLayoutHeader } from "./SwitchLayoutHeader";


export const KolFeedbackScreen = () => {
    const { params } = useRoute();
    const title = get(params, 'title')
    const [orderingType, setOrder] = useState(feedbackOrderingList[0]);
    const modalRef = useRef<FeedbackOrderingModalRef>();
    const listRef = useRef<FeedbackListRef>();

    const fetch = (next?: string) => {
        return getFeedbackListV2(next, { is_feedback: true, ordering: FeedbackOrdering.recent });
    };

    return <View style={{ flex: 1 }}>
        <ConnectionDetection.View>
            <SafeAreaView>
                <Header title={title} />
            </SafeAreaView>
            <FeedbackList
                renderAheadMultiply={0}
                Header={
                    <SwitchLayoutHeader
                        swicthLayout={(layout: Layout) => {
                            listRef.current?.switchLayout(layout)
                        }} />
                }
                ref={listRef}
                layout={Layout.list}
                fetch={fetch} />
        </ConnectionDetection.View>
    </View>;

};

