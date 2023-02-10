import React from 'react';
import { Path, Svg } from 'react-native-svg';

function FollowIcon(props) {
  const size = props.size || 24;
  const color = props.color || '#c7cacc';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        fill={color}
        class="cls-1"
        d="M14.5 6.51L10 2 5.5 6.51 10 11zM10 4.84l1.67 1.67L10 8.18 8.33 6.51zM20 2.5h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2zM2 20h2v-6h12v6h2v-8H2v8z"
      />
    </Svg>
  );
}

export default FollowIcon;
