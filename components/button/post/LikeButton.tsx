import React from 'react';
import { feedLikeController, FeedLikeStreamData } from "services/user";
import { useFavoriteButton } from "utils/hooks/useFavoriteButton";
import IconButton from "components/button/IconButton";
import { Colors } from 'styles';

export const LikeButton = ({ pk, like_count }: { pk: number, like_count: number }) => {


    const { onPress, marked } = useFavoriteButton<FeedLikeStreamData>({
        pk,
        controller: feedLikeController,
        // toastMessage: {
        //     marked: 'Đã thích bài viết',
        //     unmarked: 'Bỏ thích bài viết'
        // },
        prepare: (value) => {
            let nextCount = feedLikeController.likeCounts[pk] ?? like_count;
            if (value) {
                nextCount += 1;
            } else {
                nextCount = Math.max(nextCount - 1, 0);
            }

            feedLikeController.likeCounts[pk] = nextCount;
            return {
                pk, like: value
            }
        }
    })

    return <IconButton
        onPress={onPress}
        icon={marked ? 'heart_filled' : 'heart_line'}
        color={marked ? Colors.red : Colors.black}
    // source={marked ? require('assets/images/icon/fav_filled.png') : require('assets/images/icon/fav_line.png')} 
    />
}