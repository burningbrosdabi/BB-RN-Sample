import { FeedbackList, FeedbackListRef, Layout } from "components/list/post/FeedbackList.v2";
import React, { useEffect, useRef } from "react";
import { FeedbackOrdering, feedStream, getFeedbackListV2 } from "_api";
import { SwitchLayoutHeader } from "scenes/feed/SwitchLayoutHeader";

export const RecentTab = () => {
    const listRef = useRef<FeedbackListRef>();

    useEffect(() => {
        const subscription = feedStream.subscribe((_) => {
            listRef?.current?.refresh();
        })
            ;
        return () => {
            subscription.unsubscribe();
        }
    }, [])

    const fetch = (next?: string) => {
        return getFeedbackListV2(next, {
            ordering: FeedbackOrdering.recent
        });
    };

    return <FeedbackList
        showScrollToTopBtn={false}
        Header={
            <SwitchLayoutHeader swicthLayout={(layout: Layout) => {
                listRef.current?.switchLayout(layout)
            }} />
        }
        floatingButtonBottomMargin={24 + 48 /*CreatingFeed (Margin + height)*/ + 24}
        layout={Layout.grid}
        renderAheadMultiply={1}
        ref={listRef} fetch={fetch} />;

};