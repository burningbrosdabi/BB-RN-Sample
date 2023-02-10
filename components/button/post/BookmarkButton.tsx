import React from 'react';
import IconButton from "../IconButton";
import { feedCollectController, FeedCollectStreamData } from "services/user";
import { useFavoriteButton } from "utils/hooks/useFavoriteButton";
import { FeedbackInfo } from "model";

export const BookmarkButton =
    ({
        data
    }: { data: FeedbackInfo }) => {
        const { pk } = data


        const { onPress, marked } = useFavoriteButton<FeedCollectStreamData>({
            pk,
            controller: feedCollectController,
            // toastMessage: {
            //     marked: 'Đã lưu bài viết',
            //     unmarked: 'Bỏ lưu bài viết'
            // },
            prepare: (value: boolean) => {
                return ({
                    pk: data.pk, is_collected: value,
                } as FeedbackInfo)
            }
        })


        return <IconButton
            onPress={onPress}
            icon={marked ? 'bookmark_filled' : 'bookmark_line'} />
    }