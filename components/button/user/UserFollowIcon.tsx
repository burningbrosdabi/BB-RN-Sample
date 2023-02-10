import React from 'react';
import { Colors } from 'styles';
import { useFollowKOL } from 'utils/hooks/useFollowKOL';
import { Link } from 'components/button/Link';

export const UserFollowButton = ({ pk, name }: { name: string; pk: number }) => {
  const { marked, excecute } = useFollowKOL({ pk, name });

  return (
    <Link
      onPress={excecute}
      blurColor={marked ? Colors.text : Colors.primary}
      style={{ textDecorationLine: 'none', backgroundColor: 'black' }}
      horizontalPadding={0}
      text={marked ? ' · đang theo' : ' · theo dõi +'}
    />
  );
};
