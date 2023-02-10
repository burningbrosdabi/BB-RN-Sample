import React from 'react';
import { Path, Svg } from 'react-native-svg';

function FollowingIcon(props) {
  const size = props.size || 24;
  const color = props.color || '#fe94aa';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        class="cls-1"
        fill={color}
        d="M10 4.84l1.67 1.67L10 8.18 8.33 6.51 10 4.84M10 2L5.5 6.51 10 11l4.5-4.5L10 2zM16.02 6.42l-2.73-2.74 1.42-1.41 1.31 1.31 2.27-2.29 1.42 1.42-3.69 3.71zM2 12v8h2v-6h12v6h2v-8H2z"
      />
    </Svg>
  );
}

export default FollowingIcon;
