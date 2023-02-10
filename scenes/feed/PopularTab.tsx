import IconButton from 'components/button/IconButton';
import { FeedbackList, FeedbackListRef, Layout } from "components/list/post/FeedbackList.v2";
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Colors } from "styles";
import { FeedbackOrdering, getFeedbackListV2 } from '_api';
import {SwitchLayoutHeader} from "scenes/feed/SwitchLayoutHeader";


export const PopularTab = () => {
    const listRef = useRef<FeedbackListRef>();

    const fetch = (next?: string) => {
        return getFeedbackListV2(next, {
            ordering: FeedbackOrdering.popular,
        });
    };

    return <FeedbackList
        renderAheadMultiply={0}
        ref={listRef} Header={
            <SwitchLayoutHeader swicthLayout={(layout: Layout) => {
                listRef.current?.switchLayout(layout)
            }} />
        } fetch={fetch} />;

};


