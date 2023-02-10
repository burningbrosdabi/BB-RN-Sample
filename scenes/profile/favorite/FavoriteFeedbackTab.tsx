import { EmptyView } from "components/empty/EmptyView";
import { ListController } from "components/list/ListController";
import { FeedbackList } from "components/list/post/FeedbackList.v2";
import { isNil } from "lodash";
import { FeedbackInfo } from "model";
import React, { useEffect, useRef } from 'react';
import {

    feedbackStream, getFollowingFeeds, getPaginationFavoriteFeedbacks
} from 'services/api/user/user.favorite.api';
import { useAsync } from "utils/hooks/useAsync";

const FeedbackTab = () => {
    const { data, excecute } = useAsync(getFollowingFeeds);
    const controller = useRef(new ListController<FeedbackInfo>()).current;

    useEffect(() => {
        if (isNil(data)) return;
        const { data: feedbacks } = data;
        controller.put(feedbacks);
    }, [data]);

    useEffect(() => {
        const sub = feedbackStream.subscribe({
            next: excecute
        });

        return () => {
            sub.unsubscribe();
        }
    }, [])

    return <FeedbackList
        controller={controller}
        fetch={getPaginationFavoriteFeedbacks}
    />
};

export default React.memo(FeedbackTab);
