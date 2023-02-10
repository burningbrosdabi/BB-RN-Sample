import { FeedbackList, FeedbackListRef } from "components/list/post/FeedbackList.v2";
import { FeedbackOrderingModalRef } from "components/list/post/FeedbackOrdering";
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Colors } from "styles";
import { feedbackOrderingList } from "utils/data";
import { getFeedbackListV2 } from '_api';
import { Header } from "components/header/Header";


const FeedbackTab = () => {
    const [orderingType, setOrder] = useState(feedbackOrderingList[0]);
    const modalRef = useRef<FeedbackOrderingModalRef>();
    const listRef = useRef<FeedbackListRef>();

    const fetch = (next?: string) => {
        return getFeedbackListV2(next);
    };

    return <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <FeedbackList
            renderAheadMultiply={0}
            ref={listRef} fetch={fetch} />
    </SafeAreaView>;

};

export default React.memo(FeedbackTab);
