import { View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Colors, Typography } from 'styles';
import { Link } from 'components/button/Link';
import {
  commentLikeController,
  CommentLikeStreamData,
} from 'services/user';
import { useFavoriteButton } from 'utils/hooks/useFavoriteButton';
import { isNil } from 'lodash';
import { CommentType } from 'model';

export const CommentLikeButton = ({
  type = CommentType.feed,
  initialCount,
  pk,
}: {
  type: CommentType;
  initialCount: number;
  pk: number;
}) => {
  const mounted = useRef(false);

  const { marked, onPress } = useFavoriteButton<CommentLikeStreamData>({
    pk,
    controller: commentLikeController[type],
    prepare: value => {
      let nextCount = commentLikeController[type].likeCounts[pk] ?? initialCount;

      if (value) {
        nextCount += 1;
      } else {
        nextCount = Math.max(nextCount - 1, 0);
      }

      commentLikeController[type].likeCounts[pk] = nextCount;

      return {
        pk,
        is_liked: value,
      };
    },
  });

  return (
    <Link
      blurColor={marked ? Colors.primary : Colors.text}
      horizontalPadding={0}
      focusColor={Colors.primary}
      style={[Typography.description, { textDecorationLine: 'none' }]}
      text={'Thích'}
      onPress={onPress}
    />
  );
};
